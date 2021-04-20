import React, { FC, useCallback, useEffect, useState } from 'react'
import { Popover, FormControlLabel, Switch } from '@material-ui/core'
import PortalState from 'libs/web/state/portal'
import IconButton from 'components/icon-button'
import HotkeyTooltip from 'components/hotkey-tooltip'
import NoteState from 'libs/web/state/note'
import { NOTE_SHARED } from 'libs/shared/meta'

const ShareModal: FC = () => {
  const { share } = PortalState.useContainer()
  const [url, setUrl] = useState<string>()
  const [copied, setCopied] = useState(false)
  const { note, updateNote } = NoteState.useContainer()

  const handleCopy = useCallback(() => {
    url && navigator.clipboard.writeText(url)
    setCopied(true)
  }, [url])

  const handleShare = useCallback(
    (_event, checked: boolean) => {
      updateNote({
        shared: checked ? NOTE_SHARED.PUBLIC : NOTE_SHARED.PRIVATE,
      })
    },
    [updateNote]
  )

  useEffect(() => {
    setUrl(location.href)
  }, [])

  return (
    <Popover
      anchorEl={share.anchor}
      open={!!share.anchor}
      onClose={share.close}
      classes={{
        paper: 'bg-gray-200 text-gray-800',
      }}
    >
      <section className="p-4">
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={note?.shared === NOTE_SHARED.PUBLIC}
              onChange={handleShare}
            />
          }
          classes={{
            root: 'ml-0',
          }}
          label={
            <div className="mr-2">
              <h2 className="text-sm">公开分享</h2>
              <p className="text-xs text-gray-500">
                开启后任何人都可以通过此链接访问页面
              </p>
            </div>
          }
          labelPlacement="start"
        />
        <div className="flex mt-4 items-center border-solid border border-gray-300 rounded overflow-hidden">
          <input
            className="w-full px-2 outline-none"
            value={url}
            readOnly
          ></input>
          <HotkeyTooltip
            onClose={() => setCopied(false)}
            text={copied ? 'Copied!' : 'Copy to clipboard'}
          >
            <IconButton
              className="w-6 h-6 flex"
              rounded={false}
              iconClassName="w-4 h-4 m-auto"
              icon="Duplicate"
              onClick={handleCopy}
            />
          </HotkeyTooltip>
        </div>
      </section>
    </Popover>
  )
}

export default ShareModal
