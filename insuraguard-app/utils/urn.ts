export function generateURN(): string {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `IG-${year}-${code}`;
}

export async function getUniqueURN(): Promise<string> {
  const supabase = useSupabaseClient();
  let urn: string;
  let exists = true;
  
  while (exists) {
    urn = generateURN();
    const { data } = await supabase
      .from('registrations')
      .select('id')
      .eq('urn', urn)
      .single();
    exists = !!data;
  }
  
  return urn!;
}
