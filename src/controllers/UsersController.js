const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { hash } = require("bcryptjs");

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        try {
            const checkUserExist = await knex("users")
                .where({ email: email })
                .first();
    
            if(checkUserExist) { 
                throw new AppError("Este email já está cadastrado!");
            }    
        }

        catch(error) {
            return response.status(400).json({ error });
        }

        const hashedPassword = await hash(password, 8);
        
        await knex("users").insert({
            name,
            email,
            password: hashedPassword
        })
        
        return response.status(201).json();        
    }
    
}

module.exports = UsersController;
