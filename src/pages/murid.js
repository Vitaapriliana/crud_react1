import React from 'react'
import axios from 'axios'
import NavBar from '../components/navbar'
import {Button, Modal, Card, Table, Form} from 'react-bootstrap'

class Murid extends React.Component {
    constructor(){
        super();
        this.state = {
            murid: [],
            jur: [],
            id_murid: "",  
            nis_murid: "",  
            nama_murid: "",
            kelas: "",
            jurusan: "",
            poin: "",  
            action: "", 
            search: '',
            isModalOpen: false,
        }
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
          } else {
            window.location = "/login"
          }
  
          this.headerConfig.bind(this)
      }
  
      headerConfig = () => {
        let header = {
          headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
        
    }
    bind = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }
    handleAdd = () => {
        this.setState({
            id_murid: "",  
            nis_murid: "",  
            nama_murid: "",
            kelas: "",
            jurusan: "",
            poin: "",
            action: "insert",
            isModalOpen: true
        })
    }
    handleEdit = (item) => {
        this.setState({
            id_murid: item.id_murid,
            nis_murid: item.nis_murid,
            nama_murid: item.nama_murid,
            kelas: item.kelas,
            jurusan: item.jurusan,
            poin: item.poin,
            action: "update",
            isModalOpen: true
        })
    }
    handleClose = (item) => {
        this.setState({
            isModalOpen: false
        })
    }
    getMurid = () => {
        let url = "http://localhost:2000/murid";
        // mengakses api untuk mengambil data pegawai
        axios.get(url, this.headerConfig())
        .then(response => {
          // mengisikan data dari respon API ke array pegawai
          this.setState({murid: response.data.murid});
        })
        .catch(error => {
          console.log(error);
        });
    }
    findMurid = (event) => {
        let url = "http://localhost:2000/murid";
        if (event.keyCode === 13) {
        //   menampung data keyword pencarian
          let form = {
            find: this.state.search
          }
          // mengakses api untuk mengambil data pegawai
          // berdasarkan keyword
          axios.post(url, form, this.headerConfig())
          .then(response => {
            // mengisikan data dari respon API ke array pegawai
            this.setState({murid: response.data.murid});
          })
          .catch(error => {
            console.log(error);
          });
        }
    }
    componentDidMount(){
        // method yang pertama kali dipanggil pada saat load page
        this.getMurid()
        this.getJurusan()
    }

    getJurusan = () => {
      let url = "http://localhost:2000/murid/jurusan";
      // mengakses api untuk mengambil data pegawai
      axios.get(url, this.headerConfig())
      .then(response => {
        // mengisikan data dari respon API ke array pegawai
        this.setState({jur: response.data.jurusan});
      })
      .catch(error => {
        console.log(error);
      });
    }
    handleSave = (event) => {
        event.preventDefault();
        /* menampung data nip, nama dan alamat dari Form
        ke dalam FormData() untuk dikirim  */
        let url = "";
        if (this.state.action === "insert") {
          url = "http://localhost:2000/murid/save"
        } else {
          url = "http://localhost:2000/murid/update"
        }
    
        let form = {
          id_murid: this.state.id_murid,
          nis_murid: this.state.nis_murid,
          nama_murid: this.state.nama_murid,
          kelas: this.state.kelas,
          jurusan: this.state.jurusan,
          poin: this.state.poin
        }
    
        // mengirim data ke API untuk disimpan pada database
        axios.post(url, form, this.headerConfig())
        .then(response => {
          // jika proses simpan berhasil, memanggil data yang terbaru
          this.getMurid();
        })
        .catch(error => {
          console.log(error);
        });
        // menutup form modal
        this.setState({
            isModalOpen: false
        })
    }
    Drop = (id_murid) => {
        let url = "http://localhost:2000/murid/" + id_murid;
        // memanggil url API untuk menghapus data pada database
        if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
          axios.delete(url, this.headerConfig())
          .then(response => {
            // jika proses hapus data berhasil, memanggil data yang terbaru
            this.getMurid();
          })
          .catch(error => {
            console.log(error);
          });
        }
    }

    render(){
      console.log(this.state.jur)
        return(
            <>
                <NavBar />
                <Card>
                <Card.Header className="card-header bg-info text-white" align={'center'}>Data Murid</Card.Header>
                <Card.Body>
               
                <input type="text" className="form-control mb-2" name="search" value={this.state.search} onChange={this.bind} onKeyUp={this.findMurid} placeholder="Pencarian..." />
                <Button variant="success" onClick={this.handleAdd}>
                    Tambah Data
                </Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>  
                            <th>Nis</th>
                            <th>Nama</th>  
                            <th>Kelas</th>
                            <th>jurusan</th>
                            <th>Poin</th>  
                            <th>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.murid.map((item,index) => {  
                        return (  
                        <tr key={index}>  
                            <td>{item.id_murid}</td>  
                            <td>{item.nis_murid}</td>  
                            <td>{item.nama_murid}</td>
                            <td>{item.kelas}</td>
                            <td>{item.nama_jurusan}</td>
                            <td>{item.poin}</td>
                            <td>  
                            <Button className="btn btn-sm btn-info m-1" data-toggle="modal"  
                            data-target="#modal" onClick={() => this.handleEdit(item)}>  
                                Edit  
                            </Button>  
                            <Button className="btn btn-sm btn-danger m-1" onClick={() => this.Drop(item.id_murid)}>  
                                Hapus  
                            </Button>  
                            </td>  
                        </tr>  
                        );  
                    })}
                    </tbody>
                    </Table>
                   
                </Card.Body>
                </Card>

                <Modal show={this.state.isModalOpen} onHide={this.handleClose }>
                    <Modal.Header closeButton>
                    <Modal.Title>Form Murid</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={this.handleSave}>
                        <Modal.Body>
                            ID  
                            <input type="number" name="id_murid" value={this.state.id_murid} onChange={this.bind}  
                            className="form-control" required />  
                            Nis  
                            <input type="text" name="nis_murid" value={this.state.nis_murid} onChange={this.bind}  
                            className="form-control" required />  
                            Nama  
                            <input type="text" name="nama_murid" value={this.state.nama_murid} onChange={this.bind}  
                            className="form-control" required />
                            Kelas  
                            <input type="text" name="kelas" value={this.state.kelas} onChange={this.bind}  
                            className="form-control" required />
                            jurusan
                            <select name="jurusan" value={this.state.jurusan} onChange={this.bind} className="form-control" required>
                    {this.state.jur.map((item)=> {  
                    return ( <option value={item.id_jurusan}>{item.nama_jurusan}</option> )})}
                    </select> 
                            Poin  
                            <input type="text" name="poin" value={this.state.poin} onChange={this.bind}  
                            className="form-control" required />
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-sm btn-success" type="submit">  
                                Simpan  
                            </button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </>
        );
    }
}

export default Murid