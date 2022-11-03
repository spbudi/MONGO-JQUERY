let idEdit = null;
      let params = {
        page: 1
      }

      const readData = () => {
        fetch(`http://localhost:3000/users?`).then((response) => {
          if (!response.ok) {
            throw new Erorr(`HTTP error! status: ${response.status}`)
          }
          return response.json()
        }).then((response) => {
          params = { ...params, totalPages: response.totalPages }
          fetch(`http://localhost:3000/users?${new URLSearchParams(params).toString()}`).then((response) => {
            if (!response.ok) {
              throw new Erorr(`HTTP error! status ${response.status}`)
            }
            return response.json()
          }).then((response) => {
            params = { ...params, totalPages: response.totalPages }
            let html = ''
            let offset = response.offset
            response.data.forEach((item, index) => {
              html += `
                        <tr>
                            <td>${index + 1 + offset}</td>
                            <td>${item.string}</td>
                            <td>${item.integer}</td>
                            <td>${item.float}</td>
                            <td>${moment(item.date).format('DD/MMM/YYYY')}</td>
                            <td>${item.boolean}</td>
                            <td>
                                <div class="d-grid gap-2 d-md-block">
                                    <a class="btn btn-success"><i
                                            class="fa-solid fa-pencil" title="Edit" onclick='editData(${JSON.stringify(item)})''></i></a>
                                    <a class="btn btn-danger" onclick="removeData('${item._id}') "
                                        > <i
                                            class="fa-solid fa-trash-can" title="Delete" ></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        `
            })
            document.getElementById('body-users').innerHTML = html
            pagination()
          });
        })
      }

      const saveData = (e) => {
        e.preventDefault()
        const string = document.getElementById('string').value
        const integer = document.getElementById('integer').value
        const float = document.getElementById('float').value
        const date = document.getElementById('date').value
        const boolean = document.getElementById('boolean').value
        console.log(string, integer, float, date, boolean)

        if (idEdit == null) {
          fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'

            },
            body: JSON.stringify({ string, integer, float, date, boolean })
          }).then((response) => response.json()).then((data) => {
            readData()
          })
        } else {
          fetch(`http://localhost:3000/users/${idEdit}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'

            },
            body: JSON.stringify({ string, integer, float, date, boolean })
          }).then((response) => response.json()).then((data) => {
            readData()
          })
          idEdit = null;
        }
        document.getElementById('string').value = ""
        document.getElementById('integer').value = ""
        document.getElementById('float').value = ""
        document.getElementById('date').value = ""
        document.getElementById('boolean').value = ""
        console.log(string, integer, float, date, boolean)
        return false
      }
      const removeData = (id) => {
        fetch(`http://localhost:3000/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },

        }).then((response) => response.json()).then((data) => {
          readData()
        })
      }

      const editData = (data) => {

        idEdit = data._id
        document.getElementById('string').value = data.string
        document.getElementById('integer').value = data.integer
        document.getElementById('float').value = data.float
        document.getElementById('date').value = moment(data.date).format("YYYY-MM-DD")
        document.getElementById('boolean').value = data.boolean
      }

      const pagination = () => {
        let pagination = `<ul class="pagination">
                <li class="page-item${params.page == 1 ? ' disabled' : ''}">
                  <a class="page-link" id="halaman" href="javascripts:void(0)" onclick="changePage(${parseInt(params.page) - 1})" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>`
        for (let i = 1; i <= params.totalPages; i++) {
          pagination += ` 
        <li class="page-item${i == params.page ? ' active' : ''}"><a class="page-link" id="halaman" href="javascript:void(0)" id="angka" onclick="changePage(${i})">${i}</a></li>`
        }
        pagination += `<li class="page-item${params.page == params.totalPages ? ' disabled' : ''}">  
              <a class="page-link" href="javascript:void(0)" onclick="changePage(${parseInt(params.page) + 1})" id="halaman" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
              </a>
        </li>
        
        </ul>`
        document.getElementById('pagination').innerHTML = pagination
      }
      function changePage(page) {
        params = { ...params, page }
        console.log(params)
        readData()
        return false
      }

      function resetData() {
        document.getElementById('form-search').reset()
        readData()
      }

      document.getElementById('form-search').addEventListener('submit', (event) => {
        event.preventDefault()
        const page = 1
        const string = document.getElementById('searchString').value
        const integer = document.getElementById('searchInteger').value
        const float = document.getElementById('searchFloat').value
        const startDate = document.getElementById('searchStartDate').value
        const endDate = document.getElementById('searchEndDate').value
        const boolean = document.getElementById('searchBoolean').value
        params = { ...params, string, integer, float, startDate, endDate, boolean, page }
        readData()
      })
      
readData();
