module.exports = {
  demo:{
    files:[{
      expand:true,
      cwd:'<%= dirs.app %>',
      src:'demo.html',
      dest:'<%= dirs.dist.root %>'
    }]
  }
};
