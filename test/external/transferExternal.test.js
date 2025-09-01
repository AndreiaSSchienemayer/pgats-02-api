// Bibliotecas
const request = require('supertest');
const { expect } = require('chai');

// Testes
describe('Transfer', () => {
    describe('POST /transfers', () => {
        beforeEach(async () => {
            const respostaLogin = await request('http://localhost:3000')
                .post('/users/login')
                .send({
                    username: 'julio',
                    password: '123456'
                });

            token = respostaLogin.body.token;
        });

        it('API REST: Quando informo remetente e destinatario inexistentes recebo 400', async () => {
            const resposta = await request('http://localhost:3000')
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: "jose",
                    to: "isabelle",
                    value: 100
                });
            
            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado')
        });

        it('API REST: Quando informo valores válidos eu tenho sucesso com 201', async () => {
    const resposta = await request('http://localhost:3000')
        .post('/transfers')
        .set('Authorization', `Bearer ${token}`)
        .send({
            from: "julio",
            to: "priscila",
            value: 100
        });
    
    expect(resposta.status).to.equal(201);
    });

       // a) Transferência com sucesso (Mutation)
        it('API GraphQL: Transferência com sucesso', async () => {
            const mutation = `mutation {
                createTransfer(from: \"julio\", to: \"priscila\", value: 100) {
                    from
                    to
                    value
                    date
                }
            }`;
            const resposta = await request('http://localhost:3000')
                .post('/graphql')
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'application/json')
                .send({ query: mutation });

            expect(resposta.status).to.equal(200);
            expect(resposta.body.data.createTransfer.from).to.equal('julio');
            expect(resposta.body.data.createTransfer.to).to.equal('priscila');
            expect(resposta.body.data.createTransfer.value).to.equal(100);
            expect(resposta.body.data.createTransfer).to.have.property('date');
        });

        // b) Sem saldo disponível para transferência (Mutation)
        it('API GraphQL: Sem saldo disponível para transferência', async () => {
            const mutation = `mutation {
                createTransfer(from: \"julio\", to: \"priscila\", value: 999999) {
                    from
                    to
                    value
                    date
                }
            }`;
            const resposta = await request('http://localhost:3000')
                .post('/graphql')
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'application/json')
                .send({ query: mutation });

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.have.nested.property('errors[0].message').that.includes('Saldo insuficiente');
        });

        // c) Token de autenticação não informado (Mutation)
        it('API GraphQL: Token de autenticação não informado', async () => {
            const mutation = `mutation {
                createTransfer(from: \"julio\", to: \"priscila\", value: 100) {
                    from
                    to
                    value
                    date
                }
            }`;
            const resposta = await request('http://localhost:3000')
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .send({ query: mutation });

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.have.nested.property('errors[0].message').that.includes('Autenticação obrigatória');
        });
    });
});