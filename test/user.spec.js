import test from 'ava'
import supertest from 'supertest'
import app from '../server/server.js'

let api = supertest(app)
let root = '/api/'

let token = null
let person = { id: 'admin@bikefitapp.com', username: 'admin', password: '1234' }

test.serial.cb('authenticate', t => {
  api.post(root + 'Persons/login')
    .send({
      'username': person.username,
      'password': person.password
    })
    .set('Content-Type', 'application/json')
    .expect(200)
    .end((err, res) => {
      t.falsy(err)
      token = res.body.id
      t.truthy(token)
      t.end()
    })
})
