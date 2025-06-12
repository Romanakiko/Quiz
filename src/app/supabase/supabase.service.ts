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
import {IUser} from '../user/user';

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
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data?.session;
    })
    console.log('get session function fired', this._session);
    return this._session;
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

  signInWithGoogle(token: string) {
    return this.supabase.auth.signInWithIdToken({
      provider: 'google',
      token: token,
    })
  }
  signInWithOtp(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }

  signUpWithEmail(email: string, password: string) {
    return this.supabase.auth.signUp({
      email: email,
      password: password
    })
  }

  signInWithEmail(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  createUser() {
    return this.supabase.functions.invoke('create-user-on-signup', {
      body: {
        id: this._session?.user.id,
        name: this._session?.user.user_metadata['name'] ?? '',
        email: this._session?.user?.email,
      },
    });
  }

  async getUser(): Promise<{ data: IUser | null; error: any }> {
    return this.supabase.from('User').select('*').single();
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
