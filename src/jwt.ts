interface JWT {
  generateToken: (payload: JwtPayload) => string;
  verifyToken: (token: string) => JwtPayload | string | false;
}

import jwtBase, { JwtPayload } from "jsonwebtoken";

const secretKey: jwtBase.Secret = process.env.SECRET_KEY as unknown as jwtBase.Secret;

const jwt = {
  generateToken: (payload:JwtPayload):string => {
    const options = { expiresIn: "24h" };
    const token = jwtBase.sign({ payload }, secretKey, options);
    return token;
  },
  verifyToken: (token:string) => {
    let result:ReturnType<JWT['verifyToken']> = false;

    try {
      result = jwtBase.verify(token, secretKey);
    } catch (err:unknown) {
      if(err instanceof Error)
        console.log(err);
      result = false;
    }

    return result;
  },
};

module.exports = jwt;
