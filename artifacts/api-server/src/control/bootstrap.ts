import { clerkClient } from "@clerk/express";
import { pool } from "./core";
import { logger } from "../lib/logger";

/** Target-environment bootstrap, never embeds or logs credentials. */
export async function bootstrapControlAdmin() {
  const email=process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const password=process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if(!email||!password) {logger.warn("Conta inicial não configurada em Secrets");return;}
  const known=await pool.query("SELECT id FROM vc_users WHERE email=$1",[email]);
  if(known.rows[0]) return; // revoked privileges must never be re-granted.
  const list=await clerkClient.users.getUserList({emailAddress:[email]});
  let user=list.data[0];
  if(!user) user=await clerkClient.users.createUser({emailAddress:[email],password,publicMetadata:{verdantBootstrap:true}});
  else if(user.publicMetadata.verdantBootstrap!==true) throw new Error("Conta existente requer confirmação de propriedade antes de conceder administração.");
  await pool.query("INSERT INTO vc_users(id,email,platform_admin) VALUES($1,$2,true) ON CONFLICT DO NOTHING",[user.id,email]);
  logger.info("Conta inicial provisionada com autenticação gerenciada");
}
