import { CryptoKeyUtil } from "./utils/crypto_key_util.ts";

export const AuthService = {
  generate_token_pairs,
  verify_access_token,
  verify_refresh_token,
};

const issuer = "demo.only";

async function verify_access_token(access: string) {
  const payload = await CryptoKeyUtil.verify_jwt({
    token: access,
    publicKeyPem: "ACCESS_TOKEN_PUBLIC_KEY",
  });

  return payload;
}

async function verify_refresh_token(refresh: string) {
  const payload = await CryptoKeyUtil.verify_jwt({
    token: refresh,
    publicKeyPem: "REFRESH_TOKEN_PUBLIC_KEY",
  });

  return payload;
}

async function generate_token_pairs(sub: string, options: {
  access_expires_after: number;
  refresh_expires_after: number;
}) {
  const {
    access_expires_after,
    refresh_expires_after,
  } = options;
  const [access, refresh] = await Promise.all([
    CryptoKeyUtil.sign_jwt({
      issuer,
      user_id: sub,
      expiresIn: new Date(Date.now() + access_expires_after),
      privateKeyPem: "ACCESS_TOKEN_PRIVATE_KEY",
    }),
    CryptoKeyUtil.sign_jwt({
      issuer,
      user_id: sub,
      expiresIn: new Date(Date.now() + refresh_expires_after),
      privateKeyPem: "REFRESH_TOKEN_PRIVATE_KEY",
    }),
  ]);

  return {
    access_token: access.token,
    refresh_token: refresh.token,
    token_type: "bearer",
  };
}
