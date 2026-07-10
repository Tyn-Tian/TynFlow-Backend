import { Hono } from 'hono'
import { Bindings, Variables } from './config/env';
import { injectSupabase } from './middlewares/auth.middleware';
import walletRoute from './routes/wallet.route';
import { cors } from 'hono/cors';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use("*", cors({ origin: "*" }))
app.use("*", injectSupabase);

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/wallets", walletRoute)

export default app
