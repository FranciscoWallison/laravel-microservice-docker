/* eslint-disable no-template-curly-in-string */
import { setLocale, LocaleObject } from 'yup';

const ptBr: LocaleObject = {
    mixed: {
        required: '${path} é requerido',
        notType: '${path} é inválido',
    },
    string: {
        max: '${path} precisa ter no máximo ${max} caracteres'
    },
    number: {
        min: '${path} precisa ser no mínimo ${min}'
    }
};

setLocale(ptBr);

export * from 'yup';