import { useSearchParams } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import { TypeOfPrintMapping } from './constants/TypeOfPrint';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDecodedPaths } from './helpers/GetDecodedPaths';
const A4WIDTH_DEF = 20;
const A4HEIGTH_DEF = 28.7;
function App() {
  const [searchParams] = useSearchParams();
  const imagePaths = searchParams.get('imagePaths');
  const [selectedItem, setSelectedItem] = useState(null);
  const [forceSize, setForceSize] = useState(false);
  const [custom, setCustom] = useState(false);
  const [isVertical, setIsVertical] = useState(true);
  const [customHeight, setCustomHeight] = useState('');
  const [customWidth, setCustomWidth] = useState('');
  const [n_copies, setNCopies] = useState(1);
  const finalWidth = isVertical ? A4WIDTH_DEF : A4HEIGTH_DEF;
  const finalHeight = isVertical ? A4HEIGTH_DEF : A4WIDTH_DEF;
  const getNumericHandleChange = (max, setter, min=0) => (e) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      setter('');
      return;
    }
    const sanitizedValue = inputValue.replace(/[^0-9.]/g, '');
    const parts = sanitizedValue.split('.');
    if (parts.length > 2) {
      e.preventDefault();
      return;
    }
    if (parts[1] && parts[1].length > 2) {
      e.preventDefault();
      return;
    }
    const numericValue = parseFloat(sanitizedValue);
    if (isNaN(numericValue)) {
      e.preventDefault();
      return;
    }
    if (numericValue < min) {
      e.preventDefault();
      return;
    }
    if (numericValue > max) {
      e.preventDefault();
      return;
    }
    setter(sanitizedValue);
  };
  const paths = getDecodedPaths(imagePaths);
  const postConvertImages = async () => {
    const options = custom
      ? {
          maxHeight: customHeight,
          maxWidth: customWidth,
          isVertical,
        }
      : TypeOfPrintMapping[selectedItem];

    options.imagePaths = paths.map(path => {
      return {
        path,
        numberOfCopies: n_copies
      }
    });
    options.forceSize = forceSize;
    console.log(options);
    const response = await fetch(
      'http://localhost:4000/image-pdf/convert-to-pdf',
      {
        method: 'POST',
        body: JSON.stringify(options),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const pdfBlob = await response.blob();
    const pdfUrl = URL.createObjectURL(pdfBlob);
    return pdfUrl;
  };

  const handleOnClicVerPdf = () => {
    if (!selectedItem & !custom) {
      toast.warning('Seleccione un tipo de impresión');
      return;
    }
    if (custom & (!customHeight | !customWidth)) {
      toast.warning('Ingrese el alto y ancho correctamente');
      return;
    }
    toast.promise(postConvertImages, {
      pending: 'Conviertiendo imágenes a PDF...',
      success: {
        render: ({ data: url }) => {
          window.open(url, '_blank');
          return 'PDF generado con éxito!';
        },
      },
      error: {
        render: () => {
          return 'Hubo un error al generar el PDF.';
        },
      },
    });
  };
  const handleForceSizeChange = (event) => {
    setForceSize(event.target.checked);
  };
  const checkSideValues = () => {
    if (customWidth > finalHeight) setCustomWidth('');
    if (customHeight > finalWidth) setCustomHeight('');
  };
  const handleIsVertical = () => {
    checkSideValues();
    setIsVertical(true);
  };
  const handleIsHorizontal = () => {
    checkSideValues();
    setIsVertical(false);
  };
  const handleCustomChange = (event) => {
    const value = event.target.checked;
    if (value) setSelectedItem(null);
    setCustom(value);
  };
  const onClickItemHandler = (value) => () => {
    if (selectedItem === value) {
      setSelectedItem(null);
      return;
    }
    setCustom(false);
    setSelectedItem(value);
  };
  return (
    <div className="main">
      <div className="tarjets">
        <div className="grid-container">
          <div
            className={
              selectedItem == 1
                ? 'img-template-block-nohover selected-item'
                : 'img-template-block'
            }
            onClick={onClickItemHandler(1)}
          >
            <div className="img-tmp-container">
              <div className="img-block">
                <div className="img">
                  <img src="./template.jpg" />
                </div>
              </div>
              <b>Fotografía de página completa</b>
            </div>
          </div>
          <div
            className={
              selectedItem == 2
                ? 'img-template-block-nohover selected-item'
                : 'img-template-block'
            }
            onClick={onClickItemHandler(2)}
          >
            <div className="img-tmp-container">
              <div className="img-block">
                <div className="img img1">
                  <img src="./template.jpg" />
                  <img src="./template.jpg" />
                </div>
              </div>
              <b>13 x 18 cm. (2)</b>
            </div>
          </div>
          <div
            className={
              selectedItem == 3
                ? 'img-template-block-nohover selected-item'
                : 'img-template-block'
            }
            onClick={onClickItemHandler(3)}
          >
            <div className="img-tmp-container">
              <div className="img-block">
                <div className="img img2">
                  <img src="./template.jpg" />
                </div>
              </div>
              <b>20 x 25 cm. (1)</b>
            </div>
          </div>
          <div
            className={
              selectedItem == 4
                ? 'img-template-block-nohover selected-item'
                : 'img-template-block'
            }
            onClick={onClickItemHandler(4)}
          >
            <div className="img-tmp-container">
              <div className="img-block">
                <div className="img img3">
                  <img src="./template.jpg" />
                  <img src="./template.jpg" />
                </div>
              </div>
              <b>10 x 15 cm. (2)</b>
            </div>
          </div>
          <div
            className={
              selectedItem == 5
                ? 'img-template-block-nohover selected-item'
                : 'img-template-block'
            }
            onClick={onClickItemHandler(5)}
          >
            <div className="img-tmp-container">
              <div className="img-block">
                <div className="img img4">
                  <div className="img-block4-grid">
                    <img src="./template.jpg" />
                    <img src="./template.jpg" />
                    <img src="./template.jpg" />
                    <img src="./template.jpg" />
                  </div>
                </div>
              </div>
              <b>9 x 13 cm. (4)</b>
            </div>
          </div>
          <div
            className={
              selectedItem == 6
                ? 'img-template-block-nohover selected-item'
                : 'img-template-block'
            }
            onClick={onClickItemHandler(6)}
          >
            <div className="img-tmp-container">
              <div className="img-block">
                <div className="img img9">
                  <div className="img-block9-grid">
                    {
                      //6 x 8.5cm
                      Array.from({ length: 9 }).map((_, i) => {
                        return <img key={i} src="./template.jpg" />;
                      })
                    }
                  </div>
                </div>
              </div>
              <b>Billetera (9)</b>
            </div>
          </div>
          <div
            className={
              selectedItem == 7
                ? 'img-template-block-nohover selected-item'
                : 'img-template-block'
            }
            onClick={onClickItemHandler(7)}
          >
            <div className="img-tmp-container">
              <div className="img-block">
                <div className="img img35">
                  <div className="img-block35-grid">
                    {
                      //6 x 8.5cm
                      Array.from({ length: 35 }).map((_, i) => {
                        return <img key={i} src="./template.jpg" />;
                      })
                    }
                  </div>
                </div>
              </div>
              <b>Hoja de contactos (35)</b>
            </div>
          </div>
        </div>
      </div>
      <div className="options">
        <div className="buttons">
          <button className="btn-main" onClick={handleOnClicVerPdf}>
            Ver PDF
          </button>
        </div>
        <div className="extras">
          <div className="force-size-container">
            <label>Forzar tamaño </label>
            <input
              type="checkbox"
              checked={forceSize}
              onChange={handleForceSizeChange}
            />
          </div>
          <div className="flex-container">
            <label style={{width: '70%'}}>N° de copias</label>
            <input
              className='input-int'
              style={{width: '30%', textAlign: 'center'}}
              type="text"
              value={n_copies}
              onChange={getNumericHandleChange(1000, setNCopies, 1)}
            />
          </div>
          <div className="custom">
            <label>Personalizado </label>
            <input
              type="checkbox"
              checked={custom}
              onChange={handleCustomChange}
            />
            <div className={custom ? '' : 'blocked-container'}>
              <div className="custom-input-container">
                <div className="side-container">
                  <label>Ancho</label>
                  <input
                    type="text"
                    className='input-int'
                    value={customWidth}
                    onChange={getNumericHandleChange(
                      finalWidth,
                      setCustomWidth
                    )}
                    placeholder={`max. ${finalWidth}cm`}
                  />
                </div>
                <div className="side-container">
                  <pre> </pre>
                  <label>X</label>
                </div>
                <div className="side-container">
                  <label>Alto</label>
                  <input
                    type="text"
                    className='input-int'
                    value={customHeight}
                    onChange={getNumericHandleChange(
                      finalHeight,
                      setCustomHeight
                    )}
                    placeholder={`max. ${finalHeight}cm`}
                  />
                </div>
              </div>
              <div className="orientation-container">
                <label>Vertical </label>
                <input
                  type="checkbox"
                  checked={isVertical}
                  onChange={handleIsVertical}
                />
                <label> Horizontal </label>
                <input
                  type="checkbox"
                  checked={!isVertical}
                  onChange={handleIsHorizontal}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
