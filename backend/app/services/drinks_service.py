from app.extensions import db
from app.models.drink import Drink
import uuid

class DrinkService:
    @staticmethod
    def get_all_drinks():
        """Get all drinks from the database."""
        try:
            drinks = Drink.query.all()
            return drinks
        except Exception as e:
            raise Exception(f"Error fetching drinks: {str(e)}")
