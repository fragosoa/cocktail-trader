from app.extensions import db


# Represents a table in a restaurant or bar.
class Table(db.Model):
    __tablename__ = 'tables'

    number = db.Column(db.Integer, unique=True, nullable=False, primary_key=True)
    capacity = db.Column(db.Integer, nullable=False, default=4)
    status = db.Column(db.String(20), nullable=False, default='available')

    orders = db.relationship('Order', back_populates='table', lazy='dynamic')

    def __repr__(self):
        return f"<Table {self.name}>"

    def to_dict(self):
        return {
            'number': str(self.number),
            'capacity': str(self.capacity),
            'status': self.status
        }