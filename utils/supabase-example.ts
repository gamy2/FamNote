/**
 * Example usage of Supabase client
 * 
 * This file demonstrates how to use the Supabase client in your app.
 * You can import the supabase client from './supabase' in any component or file.
 */

import { supabase } from './supabase';

// Example: Sign up a new user
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

// Example: Sign in a user
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

// Example: Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Example: Get current user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Example: Query data from a table
export async function fetchData(tableName: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*');
  return { data, error };
}

// Example: Insert data into a table
export async function insertData(tableName: string, data: any) {
  const { data: result, error } = await supabase
    .from(tableName)
    .insert(data)
    .select();
  return { data: result, error };
}

// Example: Update data in a table
export async function updateData(tableName: string, id: string, updates: any) {
  const { data, error } = await supabase
    .from(tableName)
    .update(updates)
    .eq('id', id)
    .select();
  return { data, error };
}

// Example: Delete data from a table
export async function deleteData(tableName: string, id: string) {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);
  return { error };
}

