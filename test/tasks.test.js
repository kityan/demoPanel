describe('GET /tasks', function () {

  it('should return error for not authenticated user', function (done) {

    request(url)
      .get('/tasks')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });

  });

  it('should return empty list of task for user1 ', function (done) {

    request(url)
      .get('/tasks')
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.eql({ tasks: [] });
        done();
      });

  });

});

describe('POST /tasks', function () {

  it('should return error for not authenticated user', function (done) {

    request(url)
      .post('/tasks')
      .send({ title: 'title' + Date.now(), body: 'body' + Date.now() })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });

  });


  it('should return error on invalid title and body', function (done) {

    request(url)
      .post('/tasks')
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.length).to.equal(2);
        done();
      });

  });


  it('should return error on invalid title', function (done) {

    request(url)
      .post('/tasks')
      .send({ body: '123' })
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.eql({ error: 'Empty task title' });
        done();
      });

  });

  it('should return error on invalid body', function (done) {

    request(url)
      .post('/tasks')
      .send({ title: '123' })
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.eql({ error: 'Empty task body' });
        done();
      });

  });

  it('should return error on invalid allowedUserIds', function (done) {

    request(url)
      .post('/tasks')
      .send({ title: '123', body: '123', allowedUserIds: 2 })
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.eql({ error: 'Invalid list of allowed user ids' });
        done();
      });

  });

  it('should create new task with author user1 ', function (done) {

    request(url)
      .post('/tasks')
      .send({ title: data.user1.title1, body: data.user1.body1 })
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body.id).to.be.a('number');
        data.user1.task1id = res.body.id;
        done();
      });

  });

  it('should create new task with author user1 allowed to user2', function (done) {

    request(url)
      .post('/tasks')
      .send({ title: data.user1.title1, body: data.user1.body1, allowedUserIds: [data.user2.id]})
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body.id).to.be.a('number');
        data.user1.task2id = res.body.id;
        done();
      });

  });


});


describe('GET /tasks', function () {

  it('should return list with two tasks for user1', function (done) {

    request(url)
      .get('/tasks')
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.tasks).to.be.a('array');
        expect(res.body.tasks).to.have.length(2);
        done();
      });

  });

  it('should return list with one task for user2 – user1\'s task2', function (done) {

    request(url)
      .get('/tasks')
      .set('Authorization', 'Bearer ' + data.user2.token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.tasks).to.be.a('array');
        expect(res.body.tasks).to.have.length(1);
        done();
      });

  });


});


