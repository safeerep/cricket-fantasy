import jwt, { Secret } from 'jsonwebtoken'

export default (userId: string) => {
    return jwt.sign(
        { userId }, process.env.JWT_TOKEN_SECRET as Secret , {expiresIn: '30d'}
    )
}