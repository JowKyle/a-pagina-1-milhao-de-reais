# Deploy (passo a passo simples, não técnico)

1. Crie conta no Supabase (https://supabase.com) e crie um projeto.
   - No painel do Supabase, abra o SQL editor e execute `sql/schema.sql`.
   - Crie um bucket no Storage chamado 'uploads' e anote as chaves (URL + anon key + service role key).
2. Crie conta no Mercado Pago (https://www.mercadopago.com.br) e obtenha seu ACCESS_TOKEN.
3. Crie repositório no GitHub e envie este projeto, ou faça upload direto no Vercel.
4. No Vercel:
   - Conecte o repositório.
   - Defina as variáveis de ambiente (copie de .env.example e preencha).
   - Deploy.
5. Teste em modo sandbox (use as credenciais de sandbox do Mercado Pago).
6. Ao confirmar que tudo funciona, coloque as chaves de produção.

Se quiser, eu posso ajudar a subir e configurar passo-a-passo.
