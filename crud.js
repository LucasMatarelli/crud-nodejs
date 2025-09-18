const sqlite3 = require('sqlite3').verbose();

// Criando ou abrindo o banco de dados em memória
const db = new sqlite3.Database(':memory:');

// Criar a tabela "pessoas"
db.serialize(() => {
  db.run("CREATE TABLE pessoas (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, idade INTEGER)");

  // Função Create
  function create(nome, idade) {
    const stmt = db.prepare("INSERT INTO pessoas (nome, idade) VALUES (?, ?)");
    stmt.run(nome, idade, function(err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Pessoa inserida com ID: ${this.lastID}`);
    });
    stmt.finalize();
  }

  // Função Read
  function read() {
    db.all("SELECT * FROM pessoas", (err, rows) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Pessoas cadastradas:");
      rows.forEach((row) => {
        console.log(`ID: ${row.id}, Nome: ${row.nome}, Idade: ${row.idade}`);
      });
    });
  }

  // Função Update
  function update(id, nome, idade) {
    const stmt = db.prepare("UPDATE pessoas SET nome = ?, idade = ? WHERE id = ?");
    stmt.run(nome, idade, id, function(err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Pessoa com ID: ${id} atualizada`);
    });
    stmt.finalize();
  }

  // Função Delete
  function deleteRecord(id) {
    const stmt = db.prepare("DELETE FROM pessoas WHERE id = ?");
    stmt.run(id, function(err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Pessoa com ID: ${id} deletada`);
    });
    stmt.finalize();
  }

  // Testando o CRUD
  create("João", 25);
  create("Maria", 30);
  
  setTimeout(() => {
    read();  // Ver todas as pessoas cadastradas

    setTimeout(() => {
      update(1, "João Silva", 26);  // Atualizando o João

      setTimeout(() => {
        deleteRecord(2);  // Deletando a Maria

        setTimeout(() => {
          read();  // Ver todas as pessoas após a atualização e exclusão
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
});

// Fechar a conexão com o banco de dados após um tempo
setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error("Erro ao fechar o banco de dados", err.message);
    }
    console.log("Banco de dados fechado.");
  });
}, 5000);
