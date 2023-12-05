const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        try {
            const checkUserExist = await knex("users")
                .where({ email: email })
                .first();
    
            if(checkUserExist) { 
                throw new AppError("Este email já está cadastrado!")
            }    
        }

        catch(error) {
            return response.status(400).json({ error });
        }
        
       await knex("users").insert({
            name,
            email,
            password
        })
        
        return response.status(201).json({ name, email, password });        
    }
}

module.exports = UsersController;
