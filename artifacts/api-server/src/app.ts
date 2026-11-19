import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import { CLERK_PROXY_PATH,clerkProxyMiddleware,getClerkProxyHost } from "./middlewares/clerkProxyMiddleware";
import controlRouter from "./control";
import { ZodError } from "zod";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.set("trust proxy",1);
app.use(CLERK_PROXY_PATH,clerkProxyMiddleware());
app.use(cors({credentials:true,origin:true}));
app.use(express.json({limit:"1mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware(req=>({
  publishableKey:publishableKeyFromHost(getClerkProxyHost(req)??"",process.env.CLERK_PUBLISHABLE_KEY),
})));

app.use("/api/control",controlRouter);
app.use("/api", router);
app.use((err:any,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{
  if(res.headersSent)return;
  if(err instanceof ZodError){res.status(400).json({error:"Confira os campos informados.",issues:err.issues.map(i=>({field:i.path.join("."),message:i.message}))});return;}
  const status=Number.isInteger(err.status)&&err.status>=400&&err.status<=599?err.status:500;
  if(status>=500)logger.error({status},"Falha na solicitação; detalhes sensíveis omitidos");
  res.status(status).json({error:status>=500?"Não foi possível concluir a operação. Tente novamente.":err.message});
});

export default app;
