describe('POST /users', function () {

  it('should create new user1', function (done) {

    request(url)
      .post('/users')
      .send({ name: data.user1.name, password: data.user1.password })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body.id).to.be.a('number');
        data.user1.id = res.body.id;
        done();
      });

  });

  it('should create new user2', function (done) {

    request(url)
      .post('/users')
      .send({ name: data.user2.name, password: data.user2.password })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body.id).to.be.a('number');
        data.user2.id = res.body.id;
        done();
      });

  });

  it('should return error on user name duplication', function (done) {

    request(url)
      .post('/users')
      .send({ name: data.user1.name, password: data.user1.password })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.eql({ error: 'User already exists' });
        done();
      });

  });

  it('should return error on invalid name and password', function (done) {

    request(url)
      .post('/users')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.length).to.equal(2);
        done();
      });

  });

  it('should return error on invalid password', function (done) {

    request(url)
      .post('/users')
      .send({ name: data.user1.name })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.eql({ error: 'Empty user password' });
        done();
      });

  });

  it('should return error on invalid name', function (done) {

    request(url)
      .post('/users')
      .send({ password: data.user1.password })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.eql({ error: 'Empty user name' });
        done();
      });

  });

});
