import { supabase } from './supabase';
import type { PartnerConnection } from './supabase';

export const partner = {
  async sendPartnerRequest(userId: string, partnerEmail: string) {
    const { data, error } = await supabase
      .from('partner_connections')
      .insert({
        user_id: userId,
        partner_email: partnerEmail,
        status: 'pending',
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async acceptPartnerRequest(connectionId: string) {
    const { data, error } = await supabase
      .from('partner_connections')
      .update({ status: 'accepted' })
      .eq('id', connectionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getPartnerConnections(userId: string) {
    const { data, error } = await supabase
      .from('partner_connections')
      .select('*')
      .or(`user_id.eq.${userId},partner_email.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async removePartnerConnection(connectionId: string) {
    const { error } = await supabase
      .from('partner_connections')
      .delete()
      .eq('id', connectionId);
    
    if (error) throw error;
  }
}; 