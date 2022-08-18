import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Utils} from '../../utils';
import {FBUserVoucher} from '../../models/FBUserVoucher';
import {UserVoucherRepository} from '../../repositories/UserVoucherRepository';
import {showToastError} from '../../common/FBToast';
import {COLORS} from '../../constants';
import {useAuth} from '../../providers/AuthProvider';
import {useIntl} from 'react-intl';
import {translateText} from '../../lang/translate';


export interface VoucherCodeInputProps {
  numberOfBoxesInBasket: number;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  foodBoxId: number;
  onAddVoucher: (voucher: FBUserVoucher, discountedPricePerBox: number) => Promise<void>,
  isOnFocus: boolean
}

const VoucherInput = (props: VoucherCodeInputProps) => {
  // TODO: make border change on error
  // TODO: disable input and button if hasAlreadyAddedPromoCode is true
  // TODO: handle discounted price

  const {
    numberOfBoxesInBasket,
    setIsLoading,
    foodBoxId,
    onAddVoucher,
    isOnFocus,
  } = props;

  const styles = stylesCreator({});
  const [hasAlreadyAddedVoucher, setHasAlreadyAddedVoucher] = useState(false);
  const [isVoucherValid, setIsVoucherValid] = useState(true);
  const [voucher, setVoucher] = useState<FBUserVoucher | null>();
  const [canAddVoucher, setCanAddVoucher] = useState(numberOfBoxesInBasket > 0 && !hasAlreadyAddedVoucher);
  const {authData} = useAuth();
  const intl = useIntl();

  const voucherChangeHandler = (v: FBUserVoucher) => {
    v = v.trim();
    setVoucher(v);
    setIsVoucherValid(true);
    setCanAddVoucher(!!v && numberOfBoxesInBasket > 0);
  };

  const addPromoCode = async () => {
    if (!canAddVoucher || !voucher) {
      return;
    }

    setIsLoading(true);

    const promoCodeRepository = new UserVoucherRepository({authData: authData!});

    try {
      const isPromoCodeValidResult = await promoCodeRepository.verify({
        voucher: voucher,
        numberOfBoxesInBasket: numberOfBoxesInBasket,
        boxId: foodBoxId,
      });

      setIsVoucherValid(isPromoCodeValidResult.isValid);

      if (!isVoucherValid) {
        showToastError(translateText(intl, 'offer.invalid_promo_code'));
      } else {
        setHasAlreadyAddedVoucher(true);
        await onAddVoucher(voucher, isPromoCodeValidResult.discountedPrice / numberOfBoxesInBasket);
      }
    } catch (e) {
      setIsVoucherValid(false);
      setVoucher('');
      setCanAddVoucher(false);
      showToastError(translateText(intl, 'backenderror.validate_promocode_error'));
    }

    setIsLoading(false);
  };

  const getTextInputStyles = () => {
    let borderColor = isVoucherValid ? '#10D53A' : '#cc0000';
    let backgroundColor = hasAlreadyAddedVoucher ? COLORS.darkgray : COLORS.white;

    return {
      ...styles.promoCodeInput,
      borderColor: borderColor,
      backgroundColor: backgroundColor,
    };
  };

  useEffect(() => {
    setCanAddVoucher(!!voucher && numberOfBoxesInBasket > 0);
    addPromoCode();
  }, [numberOfBoxesInBasket]);

  useEffect(() => {
    if (isOnFocus) {
      setHasAlreadyAddedVoucher(false);
      setIsVoucherValid(true);
      setVoucher(null);
      setCanAddVoucher(numberOfBoxesInBasket > 0 && !hasAlreadyAddedVoucher);
    }
  }, [isOnFocus]);

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.promoCodeControlsWrapper}>
        <TextInput
          editable={!hasAlreadyAddedVoucher}
          style={getTextInputStyles()}
          placeholder={translateText(intl, 'offer.promo_code_hint')}
          onChangeText={(text) => voucherChangeHandler(text)}
          value={voucher || undefined}
        />
        <TouchableOpacity
          disabled={!canAddVoucher || hasAlreadyAddedVoucher}
          style={{
            ...styles.addButtonWrapper,
            backgroundColor: !canAddVoucher || hasAlreadyAddedVoucher ? COLORS.darkgray : '#0bd53a',
          }}
          onPress={() => addPromoCode()}>
          <View>
            <Text style={styles.addButtonText}>
              {translateText(intl, 'offer.add_promo_code')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {numberOfBoxesInBasket === 0 &&
        <View style={styles.userVoucherHintTextWrapper}>
          <Text style={styles.userVoucherHintText}>
            {translateText(intl, 'offer.user_promo_add_hint')}
          </Text>
        </View>
      }

      {!isVoucherValid &&
        <View style={styles.errorTextWrapper}>
          <Text style={styles.errorText}>
            {translateText(intl, 'offer.invalid_promo_code')}
          </Text>
        </View>
      }

      {hasAlreadyAddedVoucher && (
        <View style={styles.codeSuccessfullyAddedWrapper}>
          <Text style={styles.codeSuccessfullyAddedText}>
            {translateText(intl, 'offer.promo_code_added')}
          </Text>
        </View>
      )}
    </View>
  );
  // TODO: add error
};

export default VoucherInput;

const stylesCreator = ({}: {}) => {

  return StyleSheet.create({
    mainWrapper: {flex: 1},
    promoCodeControlsWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 15,
    },
    promoCodeInput: {
      borderRadius: 10,
      borderWidth: 1,
      padding: 2,
      width: Utils.width / 2 + 30,
      height: 38,
      fontSize: 12,
    },
    addButtonWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 45,
      marginLeft: 20,
      alignSelf: 'center',
      height: 38,
      width: Utils.width / 5,
    },
    addButtonText: {color: '#fff', fontSize: 12},
    errorTextWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 15,
    },
    errorText: {fontSize: 14, fontWeight: '500', color: '#cc0000'},
    userVoucherHintTextWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 15,
    },
    userVoucherHintText: {fontSize: 14, fontWeight: '500'},
    codeSuccessfullyAddedWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 15,
    },
    codeSuccessfullyAddedText: {fontSize: 14, fontWeight: '500'},
  });
};
