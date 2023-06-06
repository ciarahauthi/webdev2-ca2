from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, EqualTo



class registrationForm(FlaskForm):
    username = StringField("Username: ", validators = [InputRequired()])
    password = PasswordField("Password: ", validators = [InputRequired()])
    confirmPassword = PasswordField("Confirm password: ", validators = [InputRequired(), EqualTo("password")])
    submit = SubmitField("Submit")

class loginForm(FlaskForm):
    username = StringField("Username :")
    password = PasswordField("Password: ", validators = [InputRequired()])
    submit = SubmitField("Submit")