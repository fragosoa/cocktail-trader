# Configuración para la app

class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://myuser:mypassword@localhost:5432/mydatabase'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    REDIS_URL = 'redis://localhost:6379/0'
    PRICE_LOCK_EXPIRATION_SECONDS = 60  # Valor por defecto, puedes cambiarlo

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
