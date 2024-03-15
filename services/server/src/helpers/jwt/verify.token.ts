import jwt from "jsonwebtoken";

export default (token: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const secret: string = process.env.JWT_TOKEN_SECRET || "";
    jwt.verify(token, secret, (err: any, decodedUser: any) => {
      if (err) resolve(false);
      else {
        resolve(true);
      }
    });
  });
};