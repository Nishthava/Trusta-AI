import psycopg2

def get_db_connection():
    conn = psycopg2.connect(
        host="aws-1-ap-northeast-2.pooler.supabase.com",
        database="postgres",
        user="postgres.ynbgjkskgubxaiotrtjb",
        password="shrashty@123",
        port=5432,
        sslmode="require"   
    )
    return conn