const { request, response } = require("express");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class TagsController {
    async index(request, response) {
        const { user_id } = request.params;
      
        try {
            const [ user ] = await knex("movie_tags")
                .where({ user_id });

            if(!user) {
                throw new AppError("Usuário não existe ou não possui tags cadastradas");
            }
        }

        catch(error) {
            return response.status(400).json({ error });
        }

        const tags = await knex("movie_tags")
            .where({ user_id })
        
        return response.json(tags);
    }
}

module.exports = TagsController;
