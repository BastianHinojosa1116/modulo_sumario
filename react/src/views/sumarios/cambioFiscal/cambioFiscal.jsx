import React from 'react'
import PageComponent from "../../../components/PageComponent";
import IndexCambioFiscalComponent from '../../../components/sumariosComponent/cambioFiscalComponent/IndexCambioFiscalComponent';
import { motion } from 'framer-motion';

function cambioFiscal() {
    return (
        <PageComponent title="Cambio de Fiscal">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <IndexCambioFiscalComponent />
            </motion.div>
        </PageComponent>
    )
}

export default cambioFiscal
