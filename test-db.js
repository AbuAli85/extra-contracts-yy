const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ekdjxzhujettocosgzql.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZGp4emh1amV0dG9jb3NnenFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMTkxMDYsImV4cCI6MjA2NDg5NTEwNn0.6VGbocKFVLNX_MCIOwFtdEssMk6wd_UQ5yNT1CfV6BA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDatabase() {
  console.log('Testing database connection...')
  
  try {
    // Test promoters table
    console.log('\n1. Testing promoters table...')
    const { data: promoters, error: promotersError } = await supabase
      .from('promoters')
      .select('*')
      .limit(5)
    
    if (promotersError) {
      console.error('Error fetching promoters:', promotersError)
    } else {
      console.log('Promoters found:', promoters?.length || 0)
      if (promoters && promoters.length > 0) {
        console.log('Sample promoter:', promoters[0])
      }
    }

    // Test contracts table
    console.log('\n2. Testing contracts table...')
    const { data: contracts, error: contractsError } = await supabase
      .from('contracts')
      .select('*')
      .limit(5)
    
    if (contractsError) {
      console.error('Error fetching contracts:', contractsError)
    } else {
      console.log('Contracts found:', contracts?.length || 0)
      if (contracts && contracts.length > 0) {
        console.log('Sample contract:', contracts[0])
      }
    }

    // Test parties table
    console.log('\n3. Testing parties table...')
    const { data: parties, error: partiesError } = await supabase
      .from('parties')
      .select('*')
      .limit(5)
    
    if (partiesError) {
      console.error('Error fetching parties:', partiesError)
    } else {
      console.log('Parties found:', parties?.length || 0)
      if (parties && parties.length > 0) {
        console.log('Sample party:', parties[0])
      }
    }

    // Test table schema
    console.log('\n4. Testing table schema...')
    const { data: schema, error: schemaError } = await supabase
      .rpc('get_table_schema', { table_name: 'promoters' })
    
    if (schemaError) {
      console.log('Schema RPC not available, trying direct query...')
      // Try a simple count query instead
      const { count, error: countError } = await supabase
        .from('promoters')
        .select('*', { count: 'exact', head: true })
      
      if (countError) {
        console.error('Error getting count:', countError)
      } else {
        console.log('Total promoters in database:', count)
      }
    } else {
      console.log('Table schema:', schema)
    }

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

testDatabase()
