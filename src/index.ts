import { Hono } from 'hono'
import { Bindings, Variables } from './config/env';
import { injectSupabase } from './middlewares/auth.middleware';
import walletRoute from './routes/wallet.route';
import { cors } from 'hono/cors';
import budgetRoute from './routes/budget.route';
import wishlistRoute from './routes/wishlist.route';
import portfolioRoute from './routes/portfolio.route';
import liveRoute from './routes/live.route';
import schedulerRoute from './routes/scheduler.route';
import transactionRoute from './routes/transaction.route';
import jobRoute from './routes/job.route';
import authRoute from './routes/auth.route';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use("*", cors({ origin: "*" }))
app.use("*", injectSupabase);

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/wallets", walletRoute)
app.route("/budgets", budgetRoute)
app.route("/wishlists", wishlistRoute)
app.route("/portfolios", portfolioRoute)
app.route("/lives", liveRoute)
app.route("/schedulers", schedulerRoute)
app.route("/transactions", transactionRoute)
app.route("/jobs", jobRoute)
app.route("/auth", authRoute)

export default app
