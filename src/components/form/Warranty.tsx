import { Button, CheckBox, TextBox } from "devextreme-react";
import React, { useMemo, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { v4 } from "uuid";
import { useClientGateApi } from "../../services/clientgate-api";
import OTPPopup from "../popup/OTPPopup";

const Warranty = () => {
  const captchaKey = "6Lf8QDAmAAAAAJJcILY1ClDbSOO1EIkmBwcMxhVB";

  const captchaRef: any = React.createRef();

  const api = useClientGateApi();

  const [formValue, setFormValue] = useState({
    PhoneNo: undefined,
    VIN: undefined,
    Checkbox: false,
    f: "",
  });

  const [captcha, setCaptcha] = useState<string | null>(null);

  const [popup, setPopup] = useState(<></>);

  const [isValidated, setIsValidated] = useState(false);

  const togglePopup = () => {
    setPopup(<></>);
  };

  const checkbox = () => {
    return (
      <>
        <div className="flex items-center gap-3 pb-3 pt-2">
          <CheckBox
            value={formValue.Checkbox}
            onValueChange={(value: any) => {
              setFormValue({ ...formValue, Checkbox: value });
            }}
          />
          <p className="font-medium">Tôi đã đọc và đồng ý</p>
        </div>
        {isValidated && !formValue.Checkbox && (
          <p className="text-[0.85em] font-medium text-[#d9534f] pl-1">
            Vui lòng đồng ý với các điều khoản!
          </p>
        )}
      </>
    );
  };

  const renderCaptcha = useMemo(() => {
    return (
      <>
        <ReCAPTCHA
          sitekey={captchaKey}
          ref={captchaRef}
          className="mt-5"
          onChange={(value: any) => {
            setCaptcha(value);
          }}
          hl="vi"
        />
      </>
    );
  }, []);

  const handleSubmit = async () => {
    setIsValidated(true);
    if (captcha && formValue.Checkbox && formValue.PhoneNo && formValue.VIN) {
      const resp = await api.InvCarWarranty_SendOTP({
        vin: formValue.VIN,
        phoneno: formValue.PhoneNo,
      });

      console.log(resp.data);

      setPopup(
        <OTPPopup
          isPopupVisible={true}
          togglePopup={togglePopup}
          uuid={v4()}
          otpCode="123456"
          closePopup={togglePopup}
        />
      );
    }
  };

  return (
    <>
      <h3 className="text-center font-medium text-lg uppercase py-5">
        Kích hoạt bảo hành điện tử
      </h3>
      <div className="px-10" content={formValue.PhoneNo}>
        <label className="font-medium">Số điện thoại</label>
        <TextBox
          placeholder="Nhập số điện thoại"
          value={formValue.PhoneNo}
          onValueChange={(value: any) =>
            setFormValue({ ...formValue, PhoneNo: value })
          }
          className="mt-2 mb-3"
        />

        {!formValue.PhoneNo && isValidated && (
          <p className="text-[0.85em] font-medium text-[#d9534f] pl-1">
            Vui lòng nhập số điện thoại!
          </p>
        )}

        <label className="font-medium">Số khung</label>
        <TextBox
          placeholder="Nhập số khung"
          value={formValue.VIN}
          onValueChange={(value: any) =>
            setFormValue({ ...formValue, VIN: value })
          }
          className="mt-2 mb-3"
        />

        {!formValue.VIN && isValidated && (
          <p className="text-[0.85em] font-medium text-[#d9534f] pl-1">
            Vui lòng nhập số khung!
          </p>
        )}

        {checkbox()}

        {renderCaptcha}
        {(!captcha || captcha == null) && isValidated && (
          <p className="text-[0.85em] font-medium text-[#d9534f] pl-1">
            Vui lòng xác thực captcha!
          </p>
        )}
        <Button
          className="text-white items-center justify-center mt-5 rounded-[5px] customBtn"
          text="Kích hoạt"
          type="danger"
          validationGroup="form"
          useSubmitBehavior={true}
          onClick={handleSubmit}
        ></Button>
      </div>

      {popup}
    </>
  );
};

export default Warranty;
