import React, { Component } from 'react';
import unauthorized from '@assets/images/bg_403_1.jpg';

import styles from './unauthorized.module.scss';

class Unauthorized extends Component {
    render() {
        return (
            <div className={styles.unauthorized}>
                <img alt="unauthorized-background" src={unauthorized} />
            </div>
        );
    }
}

export default Unauthorized;
