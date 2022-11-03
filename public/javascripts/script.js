let idEdit = null;
let params = {
  page: 1,
};

const readData = () => {
  fetch(`http://localhost:3000/users?`)
    .then((response) => {
      if (!response.ok) {
        throw new Erorr(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((response) => {
      params = { ...params, totalPages: response.totalPages };
      fetch(
        `http://localhost:3000/users?${new URLSearchParams(params).toString()}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Erorr(`HTTP error! status ${response.status}`);
          }
          return response.json();
        })
        .then((response) => {
          params = { ...params, totalPages: response.totalPages };
          let html = '';
          let offset = response.offset;
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
                                            class="fa-solid fa-pencil" title="Edit" onclick='editData(${JSON.stringify(
                                              item
                                            )})''></i></a>
                                    <a class="btn btn-danger" onclick="removeData('${
                                      item._id
                                    }') "
                                        > <i
                                            class="fa-solid fa-trash-can" title="Delete" ></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        `;
          });
          document.getElementById('body-users').innerHTML = html;
          pagination();
        });
    });
};

const saveData = (e) => {
  e.preventDefault();
  const string = $('#string').val();
  const integer = $('#integer').val();
  const float = $('#float').val();
  const date = $('#date').val();
  const boolean = $('#boolean').val();
  console.log(string, integer, float, date, boolean);

  if (idEdit == null) {
    $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/users',
      dataType: 'json',
      data: { string, integer, float, date, boolean },
    })
      .done((data) => {
        readData();
      })
      .fail((err) => {
        alert('Failed to add data');
      });
  } else {
    $.ajax({
      method: 'PUT',
      url: `http://localhost:3000/users/${idEdit}`,
      dataType: 'json',
      data: { string, integer, float, date, boolean },
    })
      .done((data) => {
        readData();
      })
      .fail((err) => {
        alert('Failed to add data');
      });
    editID = null;
  }
  $('#string').val('')
  $('#integer').val('')
  $('#float').val('')
  $('#date').val('')
  $('#boolean').val('')
};

const removeData = (id) => {
  $.ajax({
    method: 'DELETE',
    url: `http://localhost:3000/users/${id}`,
    dataType: 'json',
  })
    .done(function (response) {
      readData();
    })
    .fail(function (err) {
      alert('gagal pakai jquery');
    });
};

const editData = (user) => {
  idEdit = user._id;
  $('#string').val(user.string);
  $('#integer').val(user.integer);
  $('#float').val(user.float);
  $('#date').val(moment(user.date).format('YYYY-MM-DD'));
  $('#boolean').val(user.boolean);
};

const pagination = () => {
  let pagination = `<ul class="pagination">
                <li class="page-item${params.page == 1 ? ' disabled' : ''}">
                  <a class="page-link" id="halaman" href="javascripts:void(0)" onclick="changePage(${
                    parseInt(params.page) - 1
                  })" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>`;
  for (let i = 1; i <= params.totalPages; i++) {
    pagination += ` 
        <li class="page-item${
          i == params.page ? ' active' : ''
        }"><a class="page-link" id="halaman" href="javascript:void(0)" id="angka" onclick="changePage(${i})">${i}</a></li>`;
  }
  pagination += `<li class="page-item${
    params.page == params.totalPages ? ' disabled' : ''
  }">  
              <a class="page-link" href="javascript:void(0)" onclick="changePage(${
                parseInt(params.page) + 1
              })" id="halaman" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
              </a>
        </li>
        
        </ul>`;
  document.getElementById('pagination').innerHTML = pagination;
};
function changePage(page) {
  params = { ...params, page };
  console.log(params);
  readData();
  return false;
}

$('#resetData').on('click', (event) => {
  event.preventDefault();
  const page = 1;
  $('#form-search').trigger('reset');
  params = { page };
  readData();
});

document.getElementById('form-search').addEventListener('submit', (event) => {
  event.preventDefault();
  const page = 1;
  const string = document.getElementById('searchString').value;
  const integer = document.getElementById('searchInteger').value;
  const float = document.getElementById('searchFloat').value;
  const startDate = document.getElementById('searchStartDate').value;
  const endDate = document.getElementById('searchEndDate').value;
  const boolean = document.getElementById('searchBoolean').value;
  params = {
    ...params,
    string,
    integer,
    float,
    startDate,
    endDate,
    boolean,
    page,
  };
  readData();
});

readData();
