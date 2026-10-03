import * as Pango from '@gtkx/gi/pango'
import { AdwClamp, AdwStatusPage, AdwWrapBox } from '@gtkx/jsx/adw'
import { GtkBox, GtkButton, GtkLabel } from '@gtkx/jsx/gtk'
import { useRef, useState } from 'react'
import '@/styles.js'

const loremIpsum =
  'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magnam Aliquam Quaerat Voluptatem Ut Enim Aeque Doleamus Animo Cum Corpore Dolemus Fieri Tamen Permagna Accessio Potest Si Aliquod Aeternum Ullus Investigandi Veri Nisi Inveneris Et Quaerendi Defatigatio Turpis Est Cum Esset Accusata Et Vituperata Ab Hortensio Qui Liber Cum Et Mortem Contemnit Qua Qui Est Imbutus Quietus Esse Numquam Potest Praeterea Bona Praeterita Grata Recordatione Renovata Delectant Est Autem Situm In'

const words = loremIpsum.split(' ')

type Tag = {
  id: number
  word: string
}

export const WrapBoxDemo = () => {
  const [tags, setTags] = useState<Tag[]>(() => words.slice(0, 10).map((word, id) => ({ id, word })))
  const currentWord = useRef(10 % words.length)
  const nextId = useRef(words.length)

  const addTag = () => {
    const word = words[currentWord.current]
    currentWord.current = (currentWord.current + 1) % words.length
    setTags(previous => [...previous, { id: nextId.current++, word }])
  }

  const removeTag = (id: number) => setTags(previous => previous.filter(tag => tag.id !== id))

  return (
    <AdwStatusPage
      iconName="widget-wrap-box-symbolic"
      title="Wrap Box"
      description="A box-like widget that can wrap into multiple lines."
    >
      <AdwClamp>
        <AdwWrapBox lineSpacing={6} childSpacing={6}>
          {tags.map(({ id, word }) => (
            <GtkBox key={id} cssClasses={['tag']} hexpand={false} spacing={0}>
              <GtkLabel label={word} xalign={0} ellipsize={Pango.EllipsizeMode.END} hexpand={true} />
              <GtkButton
                iconName="window-close-symbolic"
                cssClasses={['flat', 'circular']}
                onClicked={() => removeTag(id)}
              />
            </GtkBox>
          ))}
          <GtkButton iconName="list-add-symbolic" cssClasses={['flat', 'circular']} onClicked={addTag} />
        </AdwWrapBox>
      </AdwClamp>
    </AdwStatusPage>
  )
}
