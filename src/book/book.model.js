import format from "pg-format";
import { pool } from "../database/connection.js"


const findAuthors = async () => {
    try {
        const result = await pool.query("SELECT * FROM authors");
        return result.rows
    } catch (error) {
        throw error
    }
}

const findAnAuthor = async ({ name }) => {                                       //para no agregar autor ya existente en db
    try {
        const text = "SELECT name FROM authors WHERE UPPER(name) = UPPER($1)"
        const { rows } = await pool.query(text, [name])
        return { rows }
    } catch (error) {
        console.log(error)
        throw error
    }
}

const findCategories = async () => {
    try {
        const result = await pool.query("SELECT * FROM categories");
        return result.rows
    } catch (error) {
        console.log(error)
        throw error
    }
}

const findACategory = async ({ name }) => {                                       //para no agregar categoría ya existente en db
    try {
        const text = "SELECT name FROM categories WHERE UPPER(name) = UPPER($1)"
        console.log(text)
        const { rows } = await pool.query(text, [name])
        console.log(rows)
        return { rows }
    } catch (error) {
        console.log(error)
        throw error
    }
}

const createAuthor = async (name) => {
    try {
        const text = "INSERT INTO authors (name) VALUES ($1) RETURNING name"
        const { rows } = await pool.query(text, [name])
        return { rows }
    } catch (error) {
        console.log(error)
        throw error
    }
}

const createCategory = async (name) => {
    try {
        const text = "INSERT INTO categories (name) VALUES ($1) RETURNING name"
        const { rows } = await pool.query(text, [name])
        return { rows }
    } catch (error) {
        console.log(error)
        throw error
    }
}

const findAll = async (sort, limit, page, category_id, author_id, title) => {

    let query =
        "SELECT books.id, books.title, books.image, books.description, books.price, books.stock, json_build_object('id', categories.id, 'name', categories.name) AS category, json_build_object('id', authors.id, 'name', authors.name) AS author FROM books JOIN categories ON books.category_id = categories.id JOIN authors ON books.author_id = authors.id"

    const arrayValues = [];

    let filters = [];  //filters: category_id, author_id
    //sort: authors.name, title, price

    if (category_id) {
        filters.push("category_id = %s")                                //permite seguir lógica de pg-format
        arrayValues.push(category_id)
    }

    if (author_id) {
        filters.push("author_id = %s")
        arrayValues.push(author_id)
    }

    if (title) {
        filters.push("LOWER (title) like '%%%s%%' ")
        arrayValues.push(title)
    }

    if (filters.length > 0) {
        filters = filters.join(" AND ");
        query += ` WHERE ${filters}`;
    }

    if (sort) {
        query += " ORDER BY %s %s";
        console.log(Object.keys(sort))
        console.log(Object.keys(sort)[0], sort[Object.keys(sort)[0]])
        arrayValues.push(Object.keys(sort)[0], sort[Object.keys(sort)[0]]);
    }

    if (limit) {
        query += " LIMIT %s";
        arrayValues.push(limit);
    }

    if (page) {
        query += " OFFSET %s";
        arrayValues.push((page - 1) * limit);
    }

    try {
        console.log(arrayValues)
        const finalQuery = format(query, ...arrayValues);
        console.log(finalQuery);
        const result = await pool.query(finalQuery);
        return result.rows
    } catch (error) {
        console.log(error)
        throw error
    }
}

const findOne = async (id) => {
    try {
        const text = "SELECT books.id, books.title, books.image, books.description, books.price, books.stock, json_build_object('id', categories.id, 'name', categories.name) as category, json_build_object('id', authors.id, 'name', authors.name) as author FROM books INNER JOIN categories ON books.category_id = categories.id INNER JOIN authors ON books.author_id = authors.id WHERE books.id = $1";
        const result = await pool.query(text, [id])
        return result
    } catch (error) {
        console.log(error)
        throw error
    }
}

const createBook = async (title, image, description, price, stock, category_id, author_id) => {
    try {
        const text = "INSERT INTO books (title, image, description, price, stock, category_id, author_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *"
        const result = await pool.query(text, [title, image, description, price, stock, category_id, author_id])
        return result
    } catch (error) {
        console.log(error)
        throw error
    }
}

const latest = async () => {
    try {
        const text = "SELECT * FROM books ORDER BY id DESC LIMIT 10"
        const result = await pool.query(text)
        return result
    } catch (error) {
        console.log(error)
        throw error
    }
}

const updateStock = async (stock, id) => {
    try {
        const text = "UPDATE books SET stock = $1 WHERE id = $2 RETURNING *"
        const result = await pool.query(text, [stock, id])
        return result
    } catch (error) {
        console.log(error)
        throw error
    }
}

const popular = async () => {
    try {
        const text = "SELECT books.id, books.image,books.title, books.price, COUNT(carts.id) AS purchase_count FROM books JOIN cart_details ON books.id = cart_details.book_id JOIN carts ON cart_details.cart_id = carts.id GROUP BY books.id ORDER BY purchase_count DESC LIMIT 10"
        const result = await pool.query(text)
        return result
    } catch (error) {
        console.log(error)
        throw error
    }
}


export const bookModel = {
    findAuthors,
    findAnAuthor,
    findCategories,
    findACategory,
    createAuthor,
    createCategory,
    findAll,
    findOne,
    createBook,
    latest,
    updateStock,
    popular
}