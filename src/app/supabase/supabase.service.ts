import { Injectable } from '@angular/core'
import {
  AuthChangeEvent, AuthError,
  AuthSession,
  createClient, LockFunc,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { environment} from '../../environments/environment';

export interface Profile {
  id?: string
  username: string
  website: string
  avatar_url: string
}
interface CustomLock {
  acquire(name: string): Promise<() => void>;
}

type CustomLockFunc = () => Promise<CustomLock>;

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;

  constructor() {
    console.log('SupabaseService constructor');
    // localStorage.setItem('supabase.gotrue-js.locks.debug', 'true');
    // this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey,
    //                             {auth: {
    //                                 flowType: "implicit",
    //                                 lock: this.customLockFunc as unknown as LockFunc,
    //                                 autoRefreshToken: false,
    //                               }});
    // window.addEventListener('beforeunload', () => {
    //   const lockName = `sb-${environment.projectId}-auth-token`;
    //   navigator.locks.request(lockName, { steal: true }, async () => {});
    // });
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  customLockFunc: CustomLockFunc = async () => {
    // Return a Promise that resolves to the Lock object
    return {
      async acquire(name: string) {
        const MAX_RETRIES = 5;
        const BASE_DELAY = 300;
        const LOCK_TIMEOUT = 5000;

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
          try {
            let acquired = false;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), LOCK_TIMEOUT);

            await navigator.locks.request(name, {
              signal: controller.signal,
              ifAvailable: attempt === 0, // Non-blocking on first attempt
              mode: 'exclusive'
            }, (lock) => {
              if (!lock) throw new Error('Lock unavailable');
              acquired = true;

              // Return a promise that never resolves to hold the lock
              return new Promise(() => {});
            });

            clearTimeout(timeoutId);

            if (acquired) {
              // Return the release function
              return () => {
                navigator.locks.request(name, { steal: true }, async () => {});
              };
            }
          } catch (error) {
            if (attempt === MAX_RETRIES - 1) {
              console.error(`Lock acquisition failed after ${MAX_RETRIES} attempts:`, error);
              throw error;
            }

            // Exponential backoff with jitter
            const delay = BASE_DELAY * Math.pow(2, attempt) + Math.random() * 100;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }

        throw new Error('Lock acquisition failed unexpectedly');
      }
    };
  };


  // get session() {
  //   this.getSessionSafely().then(({ data }) => {
  //     this._session = data?.session;
  //   })
  //   console.log('get session function fired', this._session);
  //   return this._session;
  // }
  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data?.session;
    })
    console.log('get session function fired', this._session);
    return this._session;
  }

  // async getSessionWithRetry(retries = 3):  Promise<{data: {session: Session}, error: null} | {data: {session: null}, error: AuthError} | {data: {session: null}, error: null}> {
  //   try {
  //     return await this.supabase.auth.getSession();
  //   } catch (error: any) {
  //     if (error.name === 'NavigatorLockAcquireTimeoutError' && retries > 0) {
  //       await new Promise(resolve => setTimeout(resolve, 300));
  //       console.log('try to get session #', retries);
  //       return this.getSessionWithRetry(retries - 1);
  //     }
  //     throw error;
  //   }
  // }

  async getSessionSafely() {
    try {
      return await this.supabase.auth.getSession();
    } catch (error: any) {
      if (error.name.includes('NavigatorLockAcquireTimeoutError')) {
        // Fallback to localStorage directly
        const sessionData = localStorage.getItem(
          `sb-${environment.projectId}-auth-token`
        );
        return {
          data: { session: sessionData ? JSON.parse(sessionData) : null },
          error: null
        };
      }
      return { data: { session: null }, error };
    }
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signInOtp(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }

  signUp(email: string, password: string) {
    return this.supabase.auth.signUp({
      email: email,
      password: password
    })
  }

  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    }

    return this.supabase.from('profiles').upsert(update)
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path)
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file)
  }
}
