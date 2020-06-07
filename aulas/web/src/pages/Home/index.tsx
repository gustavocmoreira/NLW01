import React from 'react';
import logo from '../../assets/logo.svg';
import {FiLogIn} from 'react-icons/fi'
import {Link} from 'react-router-dom';
import './style.css';
const Home = ()=>{
    return(
        <div id="page-home">
            <div className="content">
                <header>
                    <img alt="Ecoleta" src={logo} />
                </header>

                <main>
                    <h1>Seu marketplace de coleta de resíduos.</h1>

                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficente.</p>

                    <Link to="/create-point">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>
                            Cadastr um ponto de coleta
                        </strong>
                    </Link>
                </main>

                
                
            </div>
        </div>
    )
}

export default Home;