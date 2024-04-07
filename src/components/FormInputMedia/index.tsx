import api from 'app/api'
import { ChangeEvent, FC, Fragment, useEffect, useRef, useState } from 'react'

export interface IInputMediaProps {
  label?: string
  extraLabel?: string
  buttonLabel?: string
  value?: any
  onChange?: (value: any | any[]) => void
  required?: boolean
  disabled?: boolean
  error?: boolean
  labelError?: string
  className?: string
  hint?: string
  width?: string
  accept: string
  uploadMultiple?: boolean
  showPreview?: boolean
  minHeight?: number
  minWidth?: number
  maxDuration?: number
  maxSize?: number
}

const FormInputMedia: FC<IInputMediaProps> = ({
  required = false,
  label,
  extraLabel,
  buttonLabel = 'Upload Image',
  value,
  onChange,
  className = '',
  accept = 'image/*',
  uploadMultiple = false,
  showPreview = false,
  error = false,
  labelError = '',
  minHeight = 200,
  minWidth = 200,
  maxDuration = 60,
  maxSize = 60,
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const buttonInputFileRef = useRef<HTMLButtonElement>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [buttonLoading, setButtonLoading] = useState<boolean>(false)

  const clearInput = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = ''
    }
  }

  const validateImage = async (file: File) => {
    let error = false
    return new Promise((resolve) => {
      const image = new Image()
      image.src = URL.createObjectURL(file)

      image.onload = () => {
        const width = image.width
        const height = image.height
        error = width < minWidth || height < minHeight
        resolve({ error })
      }

      image.onerror = () => {
        console.error(`Error loading image: ${file.name}`)
        resolve({ error: true })
      }
    })
  }

  const validateVideo = async (file: File) => {
    let error = false
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.src = URL.createObjectURL(file)
      video.onloadedmetadata = () => {
        const { duration } = video
        const size = file.size / (1024 * 1024)
        error = duration > maxDuration || size > maxSize
        resolve({ error })
      }
    })
  }

  // const validateMultipleImages = async (files: FileList) => {
  //   const errors = [];
  //   for (let i = 0; i < files.length; i++) {
  //     console.log(files[i])
  //     const result = await validateImage(files[i]);
  //     console.log(result)
  //     errors.push(result);
  //   }
  //   return errors;
  // };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (uploadMultiple) {
      const { files } = e.target
      if (files) {
        // TODO: check FileList images size
        // const res: any = accept.startsWith('image/')
        //   ? await validateMultipleImages(files)
        //   : {}
        // console.log(res)
        setButtonLoading(true)
        api
          .uploadMultiImage(files)
          .then((res) => {
            const { data } = res
            data.length > 0 &&
              onChange &&
              onChange(
                data.map((item: any) => ({
                  id: item.id,
                  name: item.name,
                  url: item.url,
                }))
              )
            clearInput()
            setButtonLoading(false)
          })
          .catch((err) => {
            console.log(err.message)
            setButtonLoading(false)
          })
      }
    } else {
      const file = e.target.files && e.target.files[0]
      if (file) {
        const res: any = accept.startsWith('image/')
          ? await validateImage(file)
          : await validateVideo(file)
        if (res.error) {
          clearInput()
          return
        }
        setButtonLoading(true)
        const reader = new FileReader()
        reader.onloadend = () => {
          setFilePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
        api
          .uploadImage(file)
          .then((res) => {
            onChange &&
              onChange({
                id: res.data[0].id,
                name: res.data[0].name,
                url: res.data[0].url,
              })
            if (!showPreview) {
              clearInput()
            }
            setButtonLoading(false)
          })
          .catch((err) => {
            console.log(err.message)
            setButtonLoading(false)
          })
      }
    }
  }

  useEffect(() => {
    const handleDragOver = (ev: DragEvent) => {
      ev.preventDefault()
      if (buttonInputFileRef.current) {
        buttonInputFileRef.current.classList.remove('border-gray-2550')
        buttonInputFileRef.current.classList.add('border-black')
      }
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      if (buttonInputFileRef.current) {
        buttonInputFileRef.current.classList.add('border-gray-2550')
        buttonInputFileRef.current.classList.remove('border-black')
      }
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      if (buttonInputFileRef.current) {
        buttonInputFileRef.current.classList.remove('border-gray-2550')
        buttonInputFileRef.current.classList.add('border-black')
      }
    }

    if (buttonInputFileRef && buttonInputFileRef.current) {
      buttonInputFileRef.current.addEventListener('dragover', handleDragOver)
      buttonInputFileRef.current.addEventListener('dragleave', handleDragLeave)
      buttonInputFileRef.current.addEventListener('drop', handleDrop)
    }
  }, [buttonInputFileRef])

  return (
    <div
      className={'el-form-item is-required asterisk-right  ' + className}
      role="group"
    >
      {label && (
        <label className="text-[14px] flex space-x-1">
          {label}
          {required ? (
            <div className="text-[--state-error]">*</div>
          ) : (
            <span className="font-normal">optional</span>
          )}
        </label>
      )}
      <div className="el-form-item__content">
        {extraLabel && <p className="text-base text-gray-1150">{extraLabel}</p>}
        <div className={extraLabel || label ? 'mt-[12px]' : ''}>
          <div className="flex flex-col items-stretch space-y-0.5" tabIndex={0}>
            <button
              ref={buttonInputFileRef}
              className={`h-11 whitespace-nowrap rounded-md border-[1.4px] px-5 text-base font-semibold text-slate-1150 shadow-dashboardButtons ${
                error ? 'border-[--state-error]' : 'border-gray-2550'
              } ${
                buttonLoading ? 'cursor-not-allowed bg-gray-200' : 'bg-white'
              }`}
              onClick={
                buttonLoading
                  ? () => {}
                  : (e) => {
                      e.preventDefault()
                      inputFileRef.current?.click()
                    }
              }
            >
              {buttonLoading ? 'Uploading...' : buttonLabel}
            </button>
            <input
              className="hidden"
              name="file"
              accept={accept}
              type="file"
              ref={inputFileRef}
              onChange={handleFileChange}
              multiple={uploadMultiple}
            />
            {error && (
              <div className="text-[10px] leading-[10px] text-[--state-error]">
                {labelError}
              </div>
            )}
            {showPreview && (
              <Fragment>
                {filePreview ? (
                  <Fragment>
                    {accept.startsWith('image/') ? (
                      <div className="mt-5 h-40 w-40 overflow-hidden rounded-[10px]">
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="h-full max-h-full w-full max-w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative mt-5 h-[389px] w-[222px] rounded-md">
                        <video
                          autoPlay
                          muted
                          src={filePreview}
                          className="h-full w-full rounded-md object-cover"
                          loop
                          playsInline
                        ></video>
                      </div>
                    )}
                  </Fragment>
                ) : (
                  <Fragment>
                    {accept.startsWith('image/') ? (
                      <Fragment>
                        {value?.url && (
                          <div className="mt-5 h-40 w-40 overflow-hidden rounded-[10px]">
                            <img
                              src={process.env.REACT_APP_URL_BE + value.url}
                              alt="Preview"
                              className="h-full max-h-full w-full max-w-full object-cover"
                            />
                          </div>
                        )}
                      </Fragment>
                    ) : (
                      <Fragment>
                        {value?.url && (
                          <div className="relative mt-5 h-[389px] w-[222px] rounded-md">
                            <video
                              autoPlay
                              muted
                              src={process.env.REACT_APP_URL_BE + value?.url}
                              className="h-full w-full rounded-md object-cover"
                              loop
                              playsInline
                            ></video>
                          </div>
                        )}
                      </Fragment>
                    )}
                  </Fragment>
                )}
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormInputMedia
