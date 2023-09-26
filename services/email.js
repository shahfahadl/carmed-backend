const emailTemplate = (text) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
</head>
<style>
  *{
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .main-table{
    max-width: 1000px;
    width: 100%;
    overflow: hidden;
  }
  .header{
    background: black;
    color: white;
    width: 100%;
    padding: 20px;
  }
  .body{
    padding: 20px;
  }
</style>
<body>
  <table class="main-table" >
    <tbody>
      <tr>
        <td align="center" class="header">
          CarMed Vehicle Services
        </td>
      </tr>
      <tr>
        <td class="body" >
          ${text}
        </td>
      </tr>
      <tr>
        <td align="center" class="header">
          <table>
            <tbody>
              <tr><td align="center" >www.carmed.onrender.com</td> </tr>
              <tr><td align="center" >&copy; 2023</td> </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>`

module.exports = {
  emailTemplate
}