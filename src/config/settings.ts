import dotenv from 'dotenv';

dotenv.config()

interface ISettings{
    MONGO_URI: string,
    PORT: string,
    JWT_SECRET_KEY: string,
    REDIS_URI: string,
    CORS_ORIGINS: string
}


const settings: ISettings = {
    MONGO_URI: process.env.MONGO_URI as string,
    PORT: process.env.PORT as string,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
    REDIS_URI: process.env.REDIS_URI as string,
    CORS_ORIGINS: process.env.CORS_ORIGINS as string
}

console.log(settings)


export default settings;