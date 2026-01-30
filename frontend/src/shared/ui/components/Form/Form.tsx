import { Button } from '../Button'
import styles from './Form.module.scss'

export const Form = () => {
  const FORM_IMAGE = '/form-image.webp'
  return (
    <div className={styles.root}>
      <form className={styles.form}>
        <div className={styles.container}>
          <input className={styles.input} type="text" placeholder="Имя" />
          <input className={styles.input} type="tel" placeholder="Телефон" />
          <div className={styles.checkboxes}>
            <span className={styles.checkboxesTitle}>Куда написать?</span>
            <div className={styles.checkboxesItems}>
              <label className={styles.checkboxesItem}>
                <input className={styles.checkboxesItemInput} type="checkbox" />
                <span className={styles.checkboxesItemText}>Whatsapp</span>
              </label>
              <label className={styles.checkboxesItem}>
                <input className={styles.checkboxesItemInput} type="checkbox" />
                <span className={styles.checkboxesItemText}>Telegram</span>
              </label>
            </div>
          </div>
          <textarea className={styles.textarea} placeholder="Введите ваш вопрос" />
        </div>
        <Button className={styles.submitButton}>Отправить</Button>
        <p className={styles.consent}>
          Отправляя заявку, вы соглашаетесь на <a href="#">обработку персональных данных</a>
        </p>
      </form>
      <img className={styles.formImage} src={FORM_IMAGE} alt="Form" />
    </div>
  )
}
