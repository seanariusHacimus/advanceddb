import React from 'react';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Alert } from "antd";
import { useLocale } from "./locale";

function sprintf() {
  const args = arguments;
  const string = args[0];
  let i = 1;
  return string.replace(/%((%)|s|d)/g, (m) => {
    let val = null;
    if (m[2]) {
      val = m[2];
    } else {
      val = args[i];
      switch (m) {
        case '%d':
          val = parseFloat(val);
          if (isNaN(val)) {
            val = 0;
          }
          break;
      }
      i++;
    }
    return val;
  });
}

function gql(str) {
  return str[0];
}

function dissoc(obj, ...props) {
  if (props) {
    return props?.reduce((acc, prop) => {
      const { [prop]: omit, ...res } = acc;
      return res;
    }, obj);
  }
  return obj;
}

function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function verboseErrors(errors) {
  if (errors) return Object.keys(errors).map((key) => `${uppercaseFirst(key.split('_').join(' '))} ${errors[key]}`);
  return ['Unexpected error'];
}

function pick(obj, keys) {
  return Object.keys(obj)
    .filter((key) => keys.indexOf(key) >= 0)
    .reduce((newObj, key) => Object.assign(newObj, { [key]: obj[key] }), {});
}

function filterVals(fn, obj) {
  if (obj) {
    return Object.keys(obj).reduce((acc, key) => {
      const val = obj[key];
      if (fn(val)) {
        return { ...acc, [key]: val };
      }
      return acc;
    }, {});
  }
}

function groupTitleToUrl(title) {
  return title?.toLowerCase().replace(/\s/g, '-');
}

function isUserAllowed(myAccount) {
  return (['superuser', 'coordinator'].includes(myAccount.role) || myAccount.leader_groups.length > 0)
}

function rankDiff(initial, current, type) {
  console.log(initial, current);
  if (type === 'score') {
    const color = initial === current ? '#717A8F' : initial > current ? 'red' : 'green';
    const icon = initial === current ? null : initial > current ? <ArrowDownOutlined /> : <ArrowUpOutlined />;
    const calculate = current - initial;
    const value = calculate ? (Math.sign(calculate) > 0 ? '+' + calculate.toFixed(1) : calculate.toFixed(1)) : null;

    return { value, icon, color }
  } else {
    const color = initial === current ? '#717A8F' : initial > current ? 'green' : 'red';
    const icon = initial === current ? null : initial > current ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
    const calculate = initial - current;
    const value = calculate ? (Math.sign(calculate) > 0 ? '+' + calculate.toFixed(1) : calculate.toFixed(1)) : null;

    return { value, icon, color }
  }

}

// TODO TRANSLATE USAGES
const roleNames = {
  superuser: 'Site Admin',
  coordinator: 'Coordinator',
  participant: 'Participant',
}

const roleWeights = {
  superuser: 5,
  coordinator: 4,
  participant: 3,
};


function update(object, key, fn) {
  return { ...object, [key]: fn(object[key]) }
}

function distinct(arr) {
  return [...new Set(arr)]
}

function parseErrors(errorsConfig, responseErrors) {
  const alerts = distinct(Object.keys(responseErrors)
    .reduce((acc, field) => {
      const error = responseErrors[field];
      const errorConfig = errorsConfig[field];
      console.assert(errorConfig, `ErrorConfig is missing for field ${field}`)
      let errorName;
      if (Array.isArray(error) && Array.isArray(error[0])) {
        errorName = error[0][0]
      } else if (Array.isArray(error)) {
        errorName = error[0]
      } else {
        errorName = error
        console.warn("Potentially, wrong error coming from backend")
      }
      const verboseError = errorsConfig[field][errorName];
      return [...acc, verboseError?.alert]

    }, [])
  );

  const errors = Object.keys(responseErrors)
    .reduce((acc, field) => {
      return update(acc, field, (v) => {
        const initial = v ? v : [];
        const error = responseErrors[field]
        const errorConfig = errorsConfig[field];

        if (Array.isArray(error)) {
          const errors = error.reduce(function (acc, errorTitle) {
            const verboseError = errorConfig[errorTitle];
            return [...acc, verboseError?.msg]
          }, [])
          return [...initial, ...errors]
        } else {
          const msg = errorsConfig[field][error]?.msg;
          if (!msg)
            return initial
          else
            return [...initial, msg]
        }
      })
    }, {});

  return {
    alerts,
    errors
  }
}

function InputErrors({ name, errors }) {
  const [t] = useLocale();
  const errorArr = errors[name]?.filter(error => error !== false);
  return (errorArr?.length > 0 && (
    <span className="input-msg error-msg">{t(errorArr[0])}</span>
  ))
}

function ErrorAlerts({ alerts, ...props }) {
  const [t] = useLocale();
  return alerts
    .filter(alert => alert !== false)
    .map(alert => alert || 'Unexpected error')
    .map(alert => (
      <Alert key={alert}
        message={t(alert)}
        type="error"
        showIcon
        style={{ marginTop: 8 }} {...props} />
    ))
}

const notEmptyErrorConfig = {
  "cannot be empty": {
    alert: "Invalid input",
    msg: "cannot be empty",
  }
}

function groupBy(items, key) {
  return items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [
        ...(result[item[key]] || []),
        item,
      ],
    }),
    {},
  );
}

function indexBy(arr, field) {
  return arr?.reduce((acc, o) => ({ ...acc, [o[field]]: o }), {});
}

export {
  dissoc,
  ErrorAlerts,
  filterVals,
  gql,
  groupBy,
  groupTitleToUrl,
  indexBy,
  InputErrors,
  isUserAllowed,
  notEmptyErrorConfig,
  parseErrors,
  pick,
  rankDiff,
  roleNames,
  roleWeights,
  sprintf,
  update,
  uppercaseFirst,
  verboseErrors
};
