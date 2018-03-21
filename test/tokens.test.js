describe('POST /tokens', function () {

  it('should create new token for user1', function (done) {

    request(url)
      .post('/tokens')
      .send({ name: data.user1.name, password: data.user1.password })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body.token).to.be.a('string');
        data.user1.token = res.body.token;
        done();
      });

  });

  it('should create new token for user2', function (done) {

    request(url)
      .post('/tokens')
      .send({ name: data.user2.name, password: data.user2.password })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body.token).to.be.a('string');
        data.user2.token = res.body.token;
        done();
      });

  });

  it('should return error on non-existing user', function (done) {

    request(url)
      .post('/tokens')
      .send({ name: data.user1.nameNotExists, password: data.user1.password })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.eql({ error: 'User not found' });
        done();
      });

  });

  it('should return error on wrong password', function (done) {

    request(url)
      .post('/tokens')
      .send({ name: data.user1.name, password: data.user1.passwordWrong })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.eql({ error: 'Wrong password' });
        done();
      });

  });


  it('should return error on invalid name and password', function (done) {

    request(url)
      .post('/tokens')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.length).to.equal(2);
        done();
      });

  });


  it('should return error on invalid password', function (done) {

    request(url)
      .post('/tokens')
      .send({ name: data.user1.name })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.eql({ error: 'Empty user password' });
        done();
      });

  });

  it('should return error on invalid name', function (done) {

    request(url)
      .post('/tokens')
      .send({ password: data.user1.password })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.eql({ error: 'Empty user name' });
        done();
      });

  });


});
