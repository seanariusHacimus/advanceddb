import React from 'react';
import { useLocale } from '../../utils/locale';
import img from '../../assets/messaging/start-messaging.svg';


export default function MembersList(props) {
  const [t] = useLocale()

  return (
    <div style={{ height: '100%', textAlign: 'center', backgroundColor: '#f8fbfd' }}>
      <img src={img} style={{ height: '100%', maxHeight: 300 }} alt="start messaging" />
      <div>{t('Start your conversation')}</div>
    </div>
  )
}
