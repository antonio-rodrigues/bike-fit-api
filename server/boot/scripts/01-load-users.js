'use strict'

module.exports = (app) => {
  /* */

  if (process.env.INITDB || process.env.INITUSERS) {
    console.log('\n[ Users ]')

    const roles = {
      superadmin: 'superadmin',
      admin: 'admin',
      motard: 'motard'
    }

    const handleError = (stack) => {
      console.error('Error: ', stack)
      return stack
    }

    const loadFile = (file) => {
      try {
        const data = require(file)
        if (data) {
          console.log(`Loaded file ${file}`)
          return (data)
        }
      } catch (exception) {
        console.warn(`Error loading file ${file}`, exception)
      }
      return (false)
    }

    const loadUserFile = (env, type) => {
      if (type) {
        if (env) {
          return (
            loadFile(`../data/${env}/users-${type}.json`) ||
            loadFile(`../data/users-${type}.json`) ||
            []
          )
        }
        return (
          loadFile(`../data/users-${type}.json`) ||
          []
        )
      }
      return ([])
    }

    const getUsers = (env) => {
      return ({
        adminUsers: loadUserFile(env, 'admin'),
        motardUsers: loadUserFile(env, 'motard')
      })
    }

    const { adminUsers, motardUsers } = getUsers(process.env.NODE_ENV)
    const Person = app.models.Person
    const Role = app.models.Role
    const RoleMapping = app.models.RoleMapping

    // wipe out models data
    if (process.env.INITUSERS !== undefined) {
      Role.destroyAll()
      Person.destroyAll()
      RoleMapping.destroyAll()
    }

    const createUsers = (users, role) => {
      if (users) {
        return Role.upsert({name: role}).then(roleObject => {
          return Promise.all(users.map(user => {
            // set email as _ID
            // Object.assign(user, {id: user.email})
            user.id = user.email

            console.info(`> Create Person: ${user.id} `)

            return Person.upsert(user).then((user) => {
              console.log(`>> Person created: ${JSON.stringify(user.id)}`)

              // Create role mapping
              return roleObject.principals.create({
                principalType: RoleMapping.USER,
                principalId: user.id // user.id
              }, (err, rolePrincipal) => {
                if (err) {
                  console.warn('\n>> Error creating rolePrincipal:\n', err)
                }
                console.info('\n>> Role mapping created:\n', JSON.stringify(rolePrincipal))
                return rolePrincipal
              })
            })
            .catch(reason => Promise.reject(handleError({ id: 100, reason })))
          }))
        })
        .catch(reason => Promise.reject(handleError({ id: 200, users, role, reason })))
      }
      return (Promise.resolve())
    }

    return (
      Promise.all([
        createUsers(adminUsers, roles.admin),
        // createUsers(motardUsers, roles.motard)
      ])
      // .catch(reason => Promise.reject(handleError({ id: 500, motardUsers, adminUsers, roles, reason })))
    )
  }

  return (Promise.resolve(true))
}
