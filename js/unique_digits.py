def countNumbersWithUniqueDigits(n):
    """
    :type n: int
    :rtype: int
    """
    last_num = 10 ** n
    result = 0
    
    for i in xrange(0, last_num):
        unique = True
        mapper = {}
        while unique:
            try:
                last_digit = i % 10
                mapper[last_digit]
                unique = False
            except:
                mapper[last_digit] = last_digit
                i = i / 10
        
        if unique == True:
            result += 1

    return result

if __name__ == '__main__':
    print countNumbersWithUniqueDigits(2)
        