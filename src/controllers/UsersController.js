const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { hash, compare } = require("bcryptjs");

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

    async update(request, response) {
        const { name, email, password, new_password } = request.body;
        const { id } = request.params;

        const [ user ] = await knex("users")
            .where({ id })

        try {
            if(!user) {
                throw new AppError("Usuário não cadastrado!");                
            }    

            if(email) {
                const [ checkEmailInUse ] = await knex("users")
                    .where({ email })
                
                if(checkEmailInUse && checkEmailInUse.id !== user.id) {
                    throw new AppError("Email já está em uso!");                
                }
            }

            if(!password) {
                throw new AppError("É necessário informar a senha para atualizar quaisquer dados do usuário.");
            }

            const checkPassword = await compare(password, user.password);

            if(!checkPassword) {
                    throw new AppError("A senha não confere.");
            }
        }

        catch(error) {
            return response.status(400).json({ error });
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if(new_password)
        {
            user.password = await hash(new_password, 8);
        } else {
            user.password = user.password;
        }
               
        await knex("users")
            .where({ id })
            .update({
            name: user.name,
            email: user.email,
            password: user.password,
            updated_at: knex.fn.now()
        })
        
        return response.status(201).json();   
    }

    async delete(request, response) {
        const { email, password } = request.body;
        const { id } = request.params;

        try {
            const [ user ] = await knex("users")
                .where({ id });

            if(!user) {
                throw new AppError("Usuário não cadastrado!");                
            }    

            if(email) {
                const [ checkEmailInUse ] = await knex("users")
                    .where({ email });      

                if(!checkEmailInUse || (checkEmailInUse && checkEmailInUse.id !== user.id)) {
                    throw new AppError("Email incorreto!");                
                }
            }

            if(!password) {
                throw new AppError("Senha incorreta.");
            }

            const checkPassword = await compare(password, user.password);

            if(!checkPassword) {
                    throw new AppError("Senha incorreta.");
            }
        }

        catch(error) {
            return response.status(400).json({ error });
        }

        await knex("users")
            .where({ id })
            .delete();

        return response.status(201).json();
    }
}

module.exports = UsersController;
