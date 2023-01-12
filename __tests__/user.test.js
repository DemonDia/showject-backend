const { request } = require("express")
const {supertest} = require("supertest")
const {app} = require("../app")

// create first

// =====================create new user=====================
describe("POST /users",()=>{
    test("Given valid name, email and password",async ()=>{
        const response = await request(app).post("/users").send({
            name:"name",
            email:"testemail1@gmail.com",
            password:"12345678"

        })
        expect(response.data.success).toBeTruthy()
        expect(response.data.data).toBeDefined()
    })
    test("When email is already taken",async ()=>{
        const response = await request(app).post("/users").send({
            name:"name",
            email:"testemail@gmail.com",
            password:"12345678"

        })
        expect(response.data.success).toBeFalsy()
        expect(response.data.message).toBeDefined()
        expect(response.data.message).toBe("Email is taken")
    })
})

// =====================get all users=====================
describe("GET /users",()=>{
    test("Get all users, user is an admin",async()=>{
        // save user details to database
        // respond with json object
        const response = await request(app).get("/users").send()
        expect(response.data.success).toBeTruthy()
        expect(response.data.data).toBeDefined()
    })
    test("Get all users, user is not admin",async()=>{
        // save user details to database
        // respond with json object
        const response = await request(app).get("/users").send()
        expect(response.data.success).toBeFalsy()
        expect(response.data.message).toBeDefined()
        expect(response.data.message).toBe("Unauthorised")
        expect(response.data.data).toBeUndefined()
    })
})

// =====================login=====================
describe("POST /users/login",()=>{
    test("Login user; matching email and pass",async()=>{
        const response = await request(app).post("/users/login").send({
            email:"testemail@gmail.com",
            password:"12345678"

        })
        expect(response.data.success).toBeTruthy()
        expect(response.data.message).toBeDefined()
        expect(response.data.data).toBeDefined()

    })
    test("Login user; existing email but wrong pass",async()=>{
        const response = await request(app).post("/users/login").send({
            email:"testemail@gmail.com",
            password:"11112222"

        })
        expect(response.data.success).toBeFalsy()
        expect(response.data.message).toBeDefined()
        expect(response.data.message).toBe("Invalid password")
        expect(response.data.data).toBeUndefined()

    })
    test("Login user; non-existing email",async()=>{
        const response = await request(app).post("/users/login").send({
            email:"testemailxxxx@gmail.com",
            password:"12345678"

        })
        expect(response.data.success).toBeFalsy()
        expect(response.data.message).toBeDefined()
        expect(response.data.message).toBe("Invalid email")
        expect(response.data.data).toBeUndefined()

    })
})



// =====================change user name=====================
describe("PUT /users/changename",()=>{
    test("Change username; user not logged in",async ()=>{
        const response = await request(app).put("/users/changename").send()
        expect(response.data.success).toBeFalsy()
        expect(response.data.message).toBeDefined()
        expect(response.data.message).toBe("Unauthorised")
        expect(response.data.data).toBeUndefined()
    })
    test("Change username; user mismatched",async ()=>{
        const response = await request(app).put("/users/changename").send()
        expect(response.data.success).toBeFalsy()
        expect(response.data.message).toBeDefined()
        expect(response.data.message).toBe("Unauthorised")
        expect(response.data.data).toBeUndefined()
    })
    test("Change username; user exists",async ()=>{
        const response = await request(app).put("/users/changename").send()
        expect(response.data.success).toBeTruthy()
        expect(response.data.message).toBeDefined()
        expect(response.data.message).toBe("Username changed")
    })
    test("Change username; user does not exist",async ()=>{
        const response = await request(app).put("/users/changename").send()
        expect(response.data.success).toBeFalsy()
        expect(response.data.message).toBeDefined()
        expect(response.data.message).toBe("User not found")
        expect(response.data.data).toBeUndefined()
        
    })
})

// =====================change user password=====================
describe("PUT /users/changepass",()=>{
    test("Change password; user exists",async ()=>{
        const response = await request(app).put("/users/changepass").send()
        expect(response.data.success).toBeTruthy()
        expect(response.data.message).toBeDefined()
        expect(response.data.message).toBe("Password reset!")
        expect(response.data.data).toBeUndefined()
    })
    test("Change password; user does not exist",async ()=>{
        const response = await request(app).put("/users/changepass").send()
        expect(response.data.success).toBeFalsy()
        expect(response.data.message).toBeDefined()
        expect(response.data.message).toBe("User not found")
        expect(response.data.data).toBeUndefined()
    })
})

// =====================send reset pass email=====================
describe("PUT /users/pass",()=>{
    test("Change username; user exists",async ()=>{
        const response = await request(app).put("/users/pass").send()
        expect(response.data.success).toBeTruthy()
        expect(response.data.message).toBeDefined()
        expect(response.data.message).toBe("Password email sent!")
    })
    test("Change username; user does not exist",async()=>{
        const response = await request(app).put("/users/pass").send()
        expect(response.data.success).toBeFalsy()
        expect(response.data.message).toBeDefined()
        expect(response.data.message).toBe("User not found")
    })
})

// =====================delete user account=====================
describe("DELETE /users/:userId",()=>{
    test("Delete user; user exists",async ()=>{
        const response = await request(app).delete("/users/:userId").send()
        expect(response.data.success).toBeTruthy()
        expect(response.data.message).toBeDefined()
        expect(response.data.message).toBe("Account deleted")
    })
    test("Delete user; user mismatch",async ()=>{
        const response = await request(app).delete("/users/:userId").send()
        expect(response.data.success).toBeFalsy()
        expect(response.data.message).toBeDefined()
        expect(response.data.message).toBe("Unauthorised")
    })
    test("Change username; user does not exist",async ()=>{
        const response = await request(app).delete("/users/:userId").send()
        expect(response.data.success).toBeTruthy()
        expect(response.data.message).toBeDefined()
        expect(response.data.message).toBe("User not found")
    })
})