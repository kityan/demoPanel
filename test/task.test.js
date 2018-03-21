describe('GET /task/:id', function () {

  it('should return error for not authenticated user', function (done) {

    request(url)
      .get('/task/' + data.user1.task1id)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });

  });

  it('should return error on invalid task id', function (done) {

    request(url)
      .get('/task/2.5')
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.eql({ error: 'Invalid task id' });
        done();
      });

  });


  it('should return task1 for user1 ', function (done) {

    request(url)
      .get('/task/' + data.user1.task1id)
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.task.title).to.equal(data.user1.title1);
        expect(res.body.task.body).to.equal(data.user1.body1);
        done();
      });

  });

  it('should return access error on user1\'s task1 for user2 ', function (done) {

    request(url)
      .get('/task/' + data.user1.task1id)
      .set('Authorization', 'Bearer ' + data.user2.token)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.eql({ error: 'Access denied' });
        done();
      });
  });

  it('should return user1\'s task2 for user2 ', function (done) {

    request(url)
      .get('/task/' + data.user1.task2id)
      .set('Authorization', 'Bearer ' + data.user2.token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.task.title).to.equal(data.user1.title2);
        expect(res.body.task.body).to.equal(data.user1.body2);
        done();
      });

  });

  it('should return error on non-existing task ', function (done) {

    request(url)
      .get('/task/' + 100000000000)
      .set('Authorization', 'Bearer ' + data.user2.token)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.eql({ error: 'Task not found' });
        done();
      });

  });


});


describe('PUT /task/:id', function () {

  it('should return error for not authenticated user', function (done) {

    request(url)
      .put('/task/' + data.user1.task1id)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });

  });

  it('should return error on invalid task id', function (done) {

    request(url)
      .put('/task/2.5')
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.eql({ error: 'Invalid task id' });
        done();
      });

  });


  it('should return error on invalid key', function (done) {

    request(url)
      .put('/task/' + data.user1.task1id)
      .send({ doby: '123' })
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.eql({ error: 'Unknown key: doby' });
        done();
      });

  });

  it('should return error on invalid allowedUserIds', function (done) {

    request(url)
      .put('/task/' + data.user1.task1id)
      .send({ allowedUserIds: 2 })
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.eql({ error: 'Invalid list of allowed user ids' });
        done();
      });

  });


  it('should update title and body for user1\'s task1', function (done) {

    request(url)
      .put('/task/' + data.user1.task1id)
      .send({ title: 'Updated title', body: 'Updated body', allowedUserIds: [] })
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });

  });

});

describe('GET /task/:id', function () {
  it('should return user1\'s task1 with updated title and body', function (done) {

    request(url)
      .get('/task/' + data.user1.task1id)
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.task.title).to.equal('Updated title');
        expect(res.body.task.body).to.equal('Updated body');
        done();
      });

  });

  it('should return user1\'s task2 for user2', function (done) {

    request(url)
      .get('/task/' + data.user1.task2id)
      .set('Authorization', 'Bearer ' + data.user2.token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.task.title).to.equal(data.user1.title2);
        expect(res.body.task.body).to.equal(data.user1.body2);
        done();
      });

  });
});

describe('PUT /task/:id', function () {

  it('should return access error when user2 tries to update user1\'s task2', function (done) {

    request(url)
      .put('/task/' + data.user1.task2id)
      .send({ title: 'test' })
      .set('Authorization', 'Bearer ' + data.user2.token)
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });

  });

  it('should remove access for user2 from user1\'s task2', function (done) {

    request(url)
      .put('/task/' + data.user1.task2id)
      .send({ allowedUserIds: [] })
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });

  });
});


describe('GET /task/:id', function () {
  it('should return access error for user2 to user1\'s task2', function (done) {

    request(url)
      .get('/task/' + data.user1.task2id)
      .set('Authorization', 'Bearer ' + data.user2.token)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.eql({ error: 'Access denied' });
        done();
      });

  });
});


describe('PUT /task/:id', function () {

  it('should allow access for user2 from user1\'s task2', function (done) {

    request(url)
      .put('/task/' + data.user1.task2id)
      .send({ allowedUserIds: [data.user2.id] })
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });

  });

});


describe('DELETE /task/:id', function () {

  it('should return error for not authenticated user', function (done) {

    request(url)
      .delete('/task/' + data.user1.task1id)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });

  });

  it('should return error on invalid task id', function (done) {

    request(url)
      .delete('/task/2.5')
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.eql({ error: 'Invalid task id' });
        done();
      });

  });

  it('should return access error when user2 tries to delete user1\'s task2', function (done) {

    request(url)
      .delete('/task/' + data.user1.task2id)
      .send({ title: 'test' })
      .set('Authorization', 'Bearer ' + data.user2.token)
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });

  });

  it('should delete task2 on user1\'s request', function (done) {

    request(url)
      .delete('/task/' + data.user1.task2id)
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });

  });

});


describe('GET /task/:id', function () {
  it('should return not found for user2 to user1\'s task2', function (done) {

    request(url)
      .get('/task/' + data.user1.task2id)
      .set('Authorization', 'Bearer ' + data.user1.token)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });

  });

  it('should return not found for user1 to user1\'s task2', function (done) {

    request(url)
      .get('/task/' + data.user1.task2id)
      .set('Authorization', 'Bearer ' + data.user2.token)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });

  });
});
